from rest_framework import viewsets

from .models import BitcoinPrice, BitcoinIndicator
from .serializers import BitcoinPriceSerializer, BitcoinIndicatorSerializer

class BitcoinPriceViewSet(viewsets.ModelViewSet):
    queryset = BitcoinPrice.objects.all()
    serializer_class = BitcoinPriceSerializer

class BitcoinIndicatorViewSet(viewsets.ModelViewSet):
    queryset = BitcoinIndicator.objects.all()
    serializer_class = BitcoinIndicatorSerializer
