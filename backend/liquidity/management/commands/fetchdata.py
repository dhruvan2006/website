from datetime import datetime
from django.core.management.base import BaseCommand
from django.core.cache import cache

from ...tasks import fetch_fred_data, fetch_tga_data, fetch_liquidity_data
from ...models import LastUpdated

class Command(BaseCommand):
    help = "Fetches and saves all five tickers required for FED Liquidity"

    def handle(self, *args, **kwargs):
        fetch_fred_data()
        fetch_tga_data()
        fetch_liquidity_data()
        LastUpdated.objects.create()  # Automaticallly set the timestamp
        self.stdout.write(self.style.SUCCESS("Successfully fetched and updated data"))
