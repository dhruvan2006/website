from django.contrib import admin

from .models import Ticker, TickerScore

admin.site.register(Ticker)
admin.site.register(TickerScore)
