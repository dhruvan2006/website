from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'prices', views.BitcoinPriceViewSet)
router.register(r'indicators', views.BitcoinIndicatorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
