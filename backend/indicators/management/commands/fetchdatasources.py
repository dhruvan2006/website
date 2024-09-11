from django.core.management.base import BaseCommand
from indicators.models import DataSource, DataSourceValue
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import json
import pandas as pd


class Command(BaseCommand):
    help = 'Fetches and updates data for data sources'

    def handle(self, *args, **options):
        fetch_block_count()
        self.stdout.write(self.style.SUCCESS('Successfully fetched data for data sources'))

def fetch_block_count():
    """Fetch data from https://studio.glassnode.com/metrics?a=BTC&m=blockchain.BlockCount"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')

    driver = webdriver.Chrome(options=chrome_options)

    try:
        # Gets necessary permissions to access the Data API
        driver.get("https://studio.glassnode.com/metrics?a=BTC&m=blockchain.BlockCount")

        # Get the data from the API
        driver.get("https://api.glassnode.com/v1/metrics/blockchain/block_count?a=BTC&c=native&i=24h&referrer=charts")

        data_element = driver.find_element(By.TAG_NAME, "pre")
        data = data_element.text

        data_json = json.loads(data)

        df = pd.DataFrame(data_json)
        df['t'] = pd.to_datetime(df['t'], unit='s')

        # Get or create DataSource
        block_count_source, _ = DataSource.objects.get_or_create(
            url='BLOCK_COUNT',
            defaults={'name': 'Daily Block Count', 'description': 'Number of blocks mined daily on the Bitcoin blockchain'}
        )

        # Update or create DataSourceValues
        for _, row in df.iterrows():
            DataSourceValue.objects.update_or_create(
                data_source=block_count_source,
                date=row['t'].date(),
                defaults={'value': row['v']}
            )
    finally:
        driver.quit()
