from rest_framework import serializers
from .models import Valuation, ValuationIndicator

class ValuationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valuation
        fields = ['date', 'value']

class ValuationIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValuationIndicator
        fields = ['indicator', 'transformation']
