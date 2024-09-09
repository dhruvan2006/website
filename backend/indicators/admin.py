from django.contrib import admin

from .models import IndicatorValue, Category, Indicator, BitcoinPrice, DataSource, DataSourceValue

# Register your models here.
admin.site.register(BitcoinPrice)
admin.site.register(Category)
admin.site.register(Indicator)
admin.site.register(IndicatorValue)
admin.site.register(DataSource)
admin.site.register(DataSourceValue)
