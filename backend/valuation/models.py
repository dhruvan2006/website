from django.db import models

from indicators.models import Indicator

class Valuation(models.Model):
    date = models.DateField()
    value = models.FloatField()

    def __str__(self):
        return f"Valuation on {self.date}: {self.value}"

class ValuationIndicator(models.Model):
    TRANSFORMATION_CHOICES = [
        ('square', 'x²'),
        ('identity', 'x'),
        ('sqrt', '√x'),
        ('log', 'ln(x)'),
        ('neg_sqrt_reciprocal', '-1/√x'),
        ('neg_reciprocal', '-1/x'),
        ('neg_square_reciprocal', '-1/x²'),
    ]

    indicator = models.OneToOneField(Indicator, on_delete=models.PROTECT)
    transformation = models.CharField(max_length=25, choices=TRANSFORMATION_CHOICES)
    logo = models.CharField(max_length=255)
    color = models.CharField(max_length=16)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['indicator', 'transformation'], name='unique_indicator_transformation')
        ]

    def __str__(self):
        return f"{self.indicator.human_name} - {self.get_transformation_display()}"
