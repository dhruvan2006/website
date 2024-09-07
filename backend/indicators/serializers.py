from rest_framework import serializers
from .models import BitcoinPrice, BitcoinIndicator

class BitcoinPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitcoinPrice
        fields = '__all__'

class BitcoinIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitcoinIndicator
        fields = '__all__'
