from django.contrib import admin

from .models import BitcoinIndicator, BitcoinPrice

# Register your models here.
admin.site.register(BitcoinPrice)
admin.site.register(BitcoinIndicator)