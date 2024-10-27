from rest_framework import serializers
from .models import Ticker, TickerScore

class TickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticker
        fields = ['ticker']

class TickerScoreSerializer(serializers.ModelSerializer):
    ticker = TickerSerializer()

    class Meta:
        model = TickerScore
        fields = ['ticker', 'date', 'score', 'last_updated']
