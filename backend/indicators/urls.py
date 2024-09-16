from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)
router.register(r'price', views.BitcoinPriceViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'indicator', views.IndicatorViewSet)
router.register(r'value', views.IndicatorValueViewSet)
router.register(r'datasource', views.DataSourceViewSet)

urlpatterns = [
    path('secret', views.secret),
    path('check_api_key', views.check_api_key),
    path('generate_api_key', views.generate_api_key),
    path('regenerate_api_key', views.regenerate_api_key),
    path('api_secret', views.api_protected),
    
    path('indicator/<str:indicator_name>', views.get_indicator_by_name),
    path('indicator/<str:indicator_name>/values', views.get_indicator_values),
    path('datasource/<str:datasource_name>', views.get_datasource_by_name),
    path('datasource/<str:datasource_name>/values', views.get_datasource_values),
    path('categories_with_indicators', views.categories_with_indicators),
    path('', include(router.urls)),
]
