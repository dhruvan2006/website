import nasdaqdatalink
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
from django.core.management.base import BaseCommand

from indicators.models import BitcoinPrice, BitcoinIndicator

class Command(BaseCommand):
    help = 'Fetch Bitcoin prices and from NasdaqDataLink and Yahoo Finance'

    def handle(self, *args, **options):
        # fetch_prices()
        self.stdout.write(self.style.SUCCESS('Successfully fetched Bitcoin prices'))
        calculate_plrr()
        self.stdout.write(self.style.SUCCESS('Successfully calculated PLRR'))

def fetch_prices():
    """Fetch Bitcoin prices and from NasdaqDataLink and Yahoo Finance"""
    # Fetch data from NasdaqDataLink (2010-08-16 to 2014-09-16)
    nasdaq_data = nasdaqdatalink.get('BCHAIN/MKPRU', start_date='2010-08-16', end_date='2014-09-16')

    for date, price in nasdaq_data.iterrows():
        BitcoinPrice.objects.update_or_create(
            date=date.date(),
            defaults={'price': price['Value']}
        )
    
    # Fetch data from Yahoo Finance (2014-09-17 to present)
    yf_data = yf.download("BTC-USD", start="2014-09-17")

    for date, row in yf_data.iterrows():
        BitcoinPrice.objects.update_or_create(
            date=date.date(),
            defaults={'price': row['Close']}
        )

def calculate_plrr():
    """
    Calculate the power law oscillator
    [1] https://x.com/math_sci_tech/status/1831083600516911566
    [2] https://github.com/assridha/Bitcoin-Power-Tools/tree/main
    """
    # Set parameters
    t0 = '2009-01-03' # Bitcoin genesis date
    k_PL = 5.7 # Power law exponent
    T_span = 365 # Span for PLRR
    risk_free_return = 0

    # Fetch all prices from db
    prices = BitcoinPrice.objects.all().order_by('date')

    df = pd.DataFrame(list(prices.values()))
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_index(inplace=True)

    t0_datetime = datetime(2009, 1, 3)

    # Calculate timeDays by subtracting t0 from the index
    df['TimeDays'] = (df.index - t0_datetime).days
    # Calculate daily log Return
    df['LogReturn'] = np.log(df['price']).diff()
    # Calculate daily log time difference
    df['LogTimeDiff'] = np.log(df['TimeDays']).diff()
    # Calculate rolling mean to log Return
    df['MeanLogReturn'] = df['LogReturn'].rolling(T_span).mean()
    # Apply rolling mean to log time difference
    df['MeanLogTimeDiff'] = df['LogTimeDiff'].rolling(T_span).mean()
    # Calculate rolling standard deviation
    df['LogSDev'] = df['LogReturn'].rolling(T_span).std()

    # Calculate Power Law Residual Ratio with scaling definition 1 (PLRR_Scale1)
    df['PLRR'] = np.sqrt(T_span)*(df['MeanLogReturn'] - k_PL*df['MeanLogTimeDiff'] - (1/365)*np.log(1+risk_free_return/100)) / df['LogSDev']

    # Save PLRR to database
    for date, row in df.iterrows():
        if pd.notna(row['PLRR']):
            BitcoinIndicator.objects.update_or_create(
                name='PLRR',
                date=date,
                defaults={'value': row['PLRR']}
            )
