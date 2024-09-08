from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import BitcoinPrice, IndicatorValue, Indicator, Category
from .serializers import BitcoinPriceSerializer, IndicatorValueSerializer, IndicatorSerializer, CategorySerializer

class BitcoinPriceViewSet(viewsets.ModelViewSet):
    queryset = BitcoinPrice.objects.all()
    serializer_class = BitcoinPriceSerializer

class IndicatorValueViewSet(viewsets.ModelViewSet):
    queryset = IndicatorValue.objects.all()
    serializer_class = IndicatorValueSerializer

class IndicatorViewSet(viewsets.ModelViewSet):
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['GET'])
def categories_with_indicators(request):
    categories = Category.objects.all()
    data = []
    for category in categories:
        indicators = Indicator.objects.filter(category=category)
        data.append({
            'category': CategorySerializer(category).data,
            'indicators': IndicatorSerializer(indicators, many=True).data
        })
    return Response(data)

@api_view(['GET'])
def get_indicator_values(request, indicator_name):
    indicator = Indicator.objects.get(url_name=indicator_name)
    values = IndicatorValue.objects.filter(indicator=indicator).order_by('date')
    serializer = IndicatorValueSerializer(values, many=True)
    return Response(serializer.data)
