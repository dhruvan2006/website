from rest_framework import serializers
from .models import BitcoinPrice, IndicatorValue, Indicator, Category

class BitcoinPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitcoinPrice
        fields = '__all__'

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class IndicatorValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicatorValue
        fields = '__all__'
