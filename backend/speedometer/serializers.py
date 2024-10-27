from rest_framework import serializers
from .models import Ticker, TickerScore

class TickerScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TickerScore
        fields = ['score']

class TickerSerializer(serializers.ModelSerializer):
    scores = serializers.ListField(child=serializers.IntegerField(), read_only=True)

    class Meta:
        model = Ticker
        fields = ['ticker', 'scores']
