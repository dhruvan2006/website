from django.db import models

class BitcoinPrice(models.Model):
    date = models.DateField()
    price = models.FloatField()

    def __str__(self):
        return f"{self.date}: {self.price}"

class BitcoinIndicator(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    value = models.FloatField()

    def __str__(self):
        return f"{self.name}: {self.value} on {self.date}"
