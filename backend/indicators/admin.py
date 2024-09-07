from django.contrib import admin

from .models import IndicatorValue, Category, Indicator, BitcoinPrice

# Register your models here.
admin.site.register(BitcoinPrice)
admin.site.register(Category)
admin.site.register(Indicator)
admin.site.register(IndicatorValue)