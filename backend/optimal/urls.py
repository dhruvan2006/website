from django.urls import path
from . import views

urlpatterns = [
    path('', views.OptimalLeverageView.as_view()),
    path('tickers', views.TickerSuggestionView.as_view()),
]