from django.contrib import admin

from .models import ValuationIndicator, Valuation

# Register your models here.
admin.site.register(Valuation)
admin.site.register(ValuationIndicator)