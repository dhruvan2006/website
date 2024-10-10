from django.http import JsonResponse
from django.conf import settings
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
        return JsonResponse({"message": "Hello, world. You're at the index. Check out the documentation at https://gnanadhandayuthapani.com/docs to get started."}, status=200)
