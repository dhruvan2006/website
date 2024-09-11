import os
from django.http import HttpResponse, Http404
from django.conf import settings

def notebook_view(request, notebook_name):
    notebook_path = os.path.join(settings.BASE_DIR, 'static', 'notebooks', f'{notebook_name}.html')

    if os.path.exists(notebook_path):
        with open(notebook_path, 'r') as file:
            return HttpResponse(file.read(), content_type='text/html')
    else:
        raise Http404(f"Notebook {notebook_name} not found")
