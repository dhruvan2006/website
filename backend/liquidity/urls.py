from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import SeriesViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'series', SeriesViewSet, basename='series')

urlpatterns = [
    path('', include(router.urls)),
    path('last_updated', views.last_updated),
]
