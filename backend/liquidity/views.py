from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import F, Sum, Case, When, Value, IntegerField
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from django.db.models.functions import Coalesce
from django.core.cache import cache

from .models import Series, LastUpdated
from .serializers import SeriesSerializer

class SeriesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        ticker = self.request.query_params.get('ticker', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if ticker:
            queryset = queryset.filter(ticker=ticker)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset.order_by('date')


def last_updated(request):
    last_updated_obj = LastUpdated.objects.last()
    if last_updated_obj:
        last_updated = last_updated_obj.timestamp.isoformat()
    else:
        last_updated = None
    return JsonResponse({'last_updated': last_updated})