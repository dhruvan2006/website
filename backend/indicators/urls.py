from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)
router.register(r'price', views.BitcoinPriceViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'indicator', views.IndicatorViewSet)
router.register(r'value', views.IndicatorValueViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('indicator/<str:indicator_name>/values', views.get_indicator_values),
    path('categories_with_indicators', views.categories_with_indicators),
]
