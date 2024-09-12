import os
import subprocess
from django.core.management.base import BaseCommand

GIT_REPO_URL = "https://github.com/dhruvan2006/indicator-research.git"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))) # Point to root directory
GIT_REPO_DIR = os.path.join(BASE_DIR, 'media', 'notebooks')
HTML_OUTPUT_DIR = os.path.join(GIT_REPO_DIR, 'html')

class Command(BaseCommand):
    help = "Update research notebooks by pulling the latest version from the repository (or cloning if it doesn't already exist)"

    def handle(self, *args, **options):
        if not os.path.exists(GIT_REPO_DIR):
            self.clone_repo()
        else:
            self.pull_latest_notebooks()
        
        self.render_notebooks()
    
    def clone_repo(self):
        result = subprocess.run(['git', 'clone', GIT_REPO_URL, GIT_REPO_DIR], capture_output=True, text=True)
        if result.returncode == 0:
            self.stdout.write(self.style.SUCCESS(f"Successfully cloned {GIT_REPO_URL} into {GIT_REPO_DIR}"))
        else:
            self.stderr.write(self.style.ERROR(f"Failed to clone {GIT_REPO_URL}: {result.stderr}"))

    def pull_latest_notebooks(self):
        os.chdir(GIT_REPO_DIR)

        result = subprocess.run(['git', 'pull'], capture_output=True, text=True)

        if result.returncode == 0:
            self.stdout.write(self.style.SUCCESS(f"Successfully pulled latest notebooks from {GIT_REPO_URL}"))
        else:
            self.stderr.write(self.style.ERROR(f"Failed to pull latest notebooks from {GIT_REPO_URL}: {result.stderr}"))
    
    def render_notebooks(self):
        if not os.path.exists(HTML_OUTPUT_DIR):
            os.makedirs(HTML_OUTPUT_DIR)
        
        for filename in os.listdir(os.path.join(GIT_REPO_DIR, 'notebooks')):
            if filename.endswith('.ipynb'):
                notebook_path = os.path.join(GIT_REPO_DIR, 'notebooks', filename)
                html_path = os.path.join(HTML_OUTPUT_DIR, f"{os.path.splitext(filename)[0]}.html")

                result = subprocess.run([
                    'jupyter', 'nbconvert', '--to', 'html', '--output', html_path, notebook_path
                ], capture_output=True, text=True)
                
                if result.returncode == 0:
                    self.stdout.write(self.style.SUCCESS(f"Successfully converted {filename} to HTML"))
                else:
                    self.stderr.write(self.style.ERROR(f"Failed to convert {filename} to HTML: {result.stderr}"))
                
