import os
from django.http import JsonResponse, HttpResponseForbidden
from django.core.management import call_command
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from indicators.models import UserAPIKey

def index(request):
    """Helper method to check if API key works"""
    api_key = request.headers.get('X-Api-Key')
    if api_key:
        try:
            UserAPIKey.objects.get_from_key(key=api_key)
            return JsonResponse({"message": "API key is valid"}, status=200)
        except UserAPIKey.DoesNotExist:
            return JsonResponse({"error": "Invalid API key"}, status=401)
    else:
        return JsonResponse({"message": "Hello, world. You're at the index. Check out the documentation at https://crypto.dhruvan.dev/docs to get started."}, status=200)

@csrf_exempt
@require_POST
def run_daily_tasks(request):
    expected_secret = os.getenv('CRON_SECRET')
    received_secret = request.headers.get('X-Cron-Secret')

    if not expected_secret or received_secret != expected_secret:
        return HttpResponseForbidden(":D")

    results = {}
    commands = [
        'fetchdatasources',
        'fetchindicators',
        'fetchdata',
        'calculate_valuation',
        'render_notebooks'
    ]

    for cmd in commands:
        try:
            call_command(cmd)
            results[cmd] = "Success"
        except Exception as e:
            results[cmd] = f"Failed: {str(e)}"

    return JsonResponse({
        "status": "completed",
        "details": results
    })
