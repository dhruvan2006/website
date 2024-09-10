from rest_framework import serializers
from .models import BitcoinPrice, IndicatorValue, Indicator, Category, DataSource, DataSourceValue

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

class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = '__all__'

class DataSourceValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSourceValue
        fields = '__all__'