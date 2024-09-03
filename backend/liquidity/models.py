from django.db import models

class Series(models.Model):
    ticker = models.CharField(max_length=32)
    date = models.DateField()
    value = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.pk}: {self.ticker}<{self.date}, {self.value}>"

class LastUpdated(models.Model):
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.pk}: {self.timestamp}"
