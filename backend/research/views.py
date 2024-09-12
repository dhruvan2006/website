import os
import hmac
import hashlib
import json
from django.http import HttpResponse, Http404, JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.management import call_command
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Point to root directory
HTML_OUTPUT_DIR = os.path.join(BASE_DIR, 'media', 'notebooks', 'html')

def notebook_list(request):
    html_files = [os.path.splitext(f)[0] for f in os.listdir(HTML_OUTPUT_DIR) if f.endswith('.html')]
    notebooks = [
        {
            'path': path,
            'name': path.replace('-', ' ').title()
        }
        for path in html_files
    ]
    return JsonResponse({'notebooks': notebooks})

def notebook_view(request, notebook_name):
    notebook_path = os.path.join(HTML_OUTPUT_DIR, f'{notebook_name}.html')

    if os.path.exists(notebook_path):
        with open(notebook_path, 'r') as file:
            return HttpResponse(file.read(), content_type='text/html')
    else:
        raise Http404(f"Notebook {notebook_name} not found")

@csrf_exempt
def github_webhook(request):
    if request.method != 'POST':
        return HttpResponse(status=405)

    # Verify the signature
    signature = request.headers.get('X-Hub-Signature-256')
    if not signature:
        return JsonResponse({'error': 'No signature'}, status=400)

    secret = os.getenv('GITHUB_WEBHOOK_SECRET').encode()
    expected_signature = 'sha256=' + hmac.new(secret, request.body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(signature, expected_signature):
        return JsonResponse({'error': 'Invalid signature'}, status=403)

    # Run the render_notebooks command
    try:
        call_command('render_notebooks')
        return JsonResponse({'message': 'Notebooks rendered successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'Error rendering notebooks: {str(e)}'}, status=500)
