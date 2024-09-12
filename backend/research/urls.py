from django.urls import path
from . import views

urlpatterns = [
    path('notebooks', views.notebook_list, name='notebook_list'),
    path('notebooks/<str:notebook_name>', views.notebook_view, name='notebook_view'),
    path('github-webhook', views.github_webhook, name='github_webhook'),
]
