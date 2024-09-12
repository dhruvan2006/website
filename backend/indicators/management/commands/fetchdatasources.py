from django.core.management.base import BaseCommand

import json
import requests
import pandas as pd
from datetime import datetime, timedelta

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from indicators.models import DataSource, DataSourceValue


class Command(BaseCommand):
    help = 'Fetches and updates data for data sources'

    def handle(self, *args, **options):
        fetch_block_count()
        fetch_mvrv()
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

def fetch_mvrv():
    """Fech data from Blockchain API https://api.blockchain.info/charts/mvrv"""
    # Get data for the last 4 years
    response_4y = requests.get("https://api.blockchain.info/charts/mvrv?timespan=4y&sampled=true&metadata=false&daysAverageString=1d&cors=true&format=json")
    json_4y = response_4y.json()
    data_4y = json_4y['values']

    # Get data for all time
    response_all = requests.get("https://api.blockchain.info/charts/mvrv?timespan=all&sampled=true&metadata=false&daysAverageString=1d&cors=true&format=json")
    json_all = response_all.json()
    data_all = json_all['values']

    # Combine 
    four_years_ago = datetime.now() - timedelta(days=4*365)
    df_4y = pd.DataFrame(data_4y)
    df_all = pd.DataFrame(data_all)

    df_4y.columns = ['Date', 'MVRV']
    df_all.columns = ['Date', 'MVRV']

    df_4y['Date'] = pd.to_datetime(pd.to_datetime(df_4y['Date'], unit='s').dt.date)
    df_all['Date'] = pd.to_datetime(pd.to_datetime(df_all['Date'], unit='s').dt.date)

    df_recent = df_4y[df_4y['Date'] >= four_years_ago]

    df_earlier = df_all[df_all['Date'] < four_years_ago]

    # Combine dfs
    df = pd.concat([df_earlier, df_recent])

    mvrv_source, _ = DataSource.objects.get_or_create(
        url='MVRV',
        defaults={'name': 'MVRV', 'description': 'Ratio of Market Value to Realized Value'}
    )

    for _, row in df.iterrows():
        DataSourceValue.objects.update_or_create(
            data_source=mvrv_source,
            date=row['Date'],
            defaults={'value': row['MVRV']}
        )
