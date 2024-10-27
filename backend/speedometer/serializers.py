from rest_framework import serializers
from .models import Ticker, TickerScore

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TickerScore
        fields = ['date', 'score', 'last_updated']

class TickerSerializer(serializers.ModelSerializer):
    scores = ScoreSerializer(source='tickerscore_set', many=True, read_only=True)
    
    class Meta:
        model = Ticker
        fields = ['ticker', 'scores']

class TickerScoreSerializer(serializers.ModelSerializer):
    ticker = TickerSerializer()

    class Meta:
        model = TickerScore
        fields = ['ticker', 'date', 'score', 'last_updated']
