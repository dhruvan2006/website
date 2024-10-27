from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TickerViewSet, TickerScoreViewSet, WebhookAPIView

router = DefaultRouter()
router.register(r'tickers', TickerViewSet)
router.register(r'ticker-scores', TickerScoreViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/', WebhookAPIView.as_view(), name='webhook')
]
