from django.contrib import admin
from rest_framework_api_key.admin import APIKeyModelAdmin
from .models import IndicatorValue, Category, Indicator, BitcoinPrice, DataSource, DataSourceValue, UserAPIKey

@admin.register(UserAPIKey)
class UserAPIKeyModelAdmin(APIKeyModelAdmin):
    list_display = [*APIKeyModelAdmin.list_display, "user__username"]
    search_fields = [*APIKeyModelAdmin.search_fields, "user__username"]


# Register your models here.
admin.site.register(BitcoinPrice)
admin.site.register(Category)
admin.site.register(Indicator)
admin.site.register(IndicatorValue)
admin.site.register(DataSource)
admin.site.register(DataSourceValue)
