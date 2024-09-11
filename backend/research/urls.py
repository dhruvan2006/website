from django.urls import path
from . import views

urlpatterns = [
    path('notebooks/<str:notebook_name>', views.notebook_view, name='notebook_view'),
]
