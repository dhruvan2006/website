from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'price', views.BitcoinPriceViewSet)
router.register(r'indicator', views.BitcoinIndicatorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
