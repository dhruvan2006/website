from django.db import models

# Bitcoin
class BitcoinPrice(models.Model):
    date = models.DateField()
    price = models.FloatField()

    def __str__(self):
        return f"{self.date}: {self.price}"

# Indicators
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Indicator(models.Model):
    url_name = models.CharField(max_length=100, unique=True)
    human_name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.human_name

class IndicatorValue(models.Model):
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE)
    date = models.DateField()
    value = models.FloatField()

    def __str__(self):
        return f"{self.indicator.human_name}: {self.value} on {self.date}"

# Data Sources
class DataSource(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class DataSourceValue(models.Model):
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE)
    date = models.DateField()
    value = models.FloatField()

    class Meta:
        unique_together = ('data_source', 'date')

    def __str__(self):
        return f"{self.data_source.name}: {self.value} on {self.date}"
