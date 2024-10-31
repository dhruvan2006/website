from rest_framework import serializers
from .models import Valuation, ValuationIndicator

class ValuationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valuation
        fields = ['date', 'value']
    
    def to_representation(self, instance):
        """Optimize serializer output"""
        return {
            'date': instance.date.isoformat(),
            'value': instance.value
        }

class ValuationIndicatorSerializer(serializers.ModelSerializer):
    indicator_name = serializers.CharField(source='indicator.human_name', read_only=True)

    class Meta:
        model = ValuationIndicator
        fields = ['indicator', 'transformation', 'logo', 'color', 'indicator_name']
