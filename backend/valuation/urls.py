from django.urls import path
from .views import ValuationView

urlpatterns = [
    path('', ValuationView.as_view(), name='valuation'),
]