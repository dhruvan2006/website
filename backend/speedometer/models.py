from django.db import models

class Ticker(models.Model):
    ticker = models.CharField(max_length=32)

    def __str__(self):
        return self.ticker

class TickerScore(models.Model):
    ticker = models.ForeignKey(Ticker, on_delete=models.CASCADE, related_name="scores")
    date = models.DateField()
    score = models.FloatField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ticker} - {self.date}: {self.score}"