import requests
import os
from datetime import datetime
from dotenv import load_dotenv
from django.db import transaction

from .models import Series

load_dotenv()

FRED_API_KEY = os.getenv("FRED_API_KEY")
FRED_API_URL = "https://api.stlouisfed.org/fred/series/observations"

def fetch_fred_data():
    print("Fetching FRED data")

    tickers = {"WALCL": 1, "RRPONTSYD": 1000, "H41RESPPALDKNWW": 1, "WLCFLPCL": 1}

    for ticker, multiplier in tickers.items():
        params = {
            "series_id": ticker,
            "api_key": FRED_API_KEY,
            "file_type": "json"
        }

        response = requests.get(FRED_API_URL, params=params)
        data = response.json()

        for observation in data["observations"]:
            if observation["value"] == ".":
                continue
        
            date = datetime.strptime(observation["date"], "%Y-%m-%d").date()
            value = float(observation["value"])

            Series.objects.update_or_create(
                ticker=ticker,
                date=date,
                defaults={"value": int(value * multiplier)}
            )

    print("FRED data updated successfully")

def fetch_tga_data():
    print("Fetching TGA data")

    ticker = "TGA"
    base_url = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/dts/operating_cash_balance"
    params = {
        "fields": "record_date,account_type,open_today_bal",
        "filter": "account_type:eq:Treasury General Account (TGA) Closing Balance",
        "page[size]": 100,
        "page[number]": 1
    }

    all_data = []
    while True:
        response = requests.get(base_url, params=params)
        data = response.json()
        
        all_data.extend(data['data'])
        
        if 'next' not in data['links'] or data['links']['next'] is None:
            break
        
        params['page[number]'] += 1

    for item in all_data:
        date = datetime.strptime(item['record_date'], "%Y-%m-%d").date()
        value = float(item['open_today_bal'])

        Series.objects.update_or_create(
            ticker=ticker,
            date=date,
            defaults={"value": int(value)}
        )

    print("TGA data updated successfully")

def fetch_liquidity_data():
    """Calculate WALCL-TGA-RRPONTSYD+H41RESPPALDKNWW+WLCFLPCL"""
    print("Calculating liquidity data")

    queryset = Series.objects.all()

    # Get all unique dates in the queryset
    all_dates = queryset.values_list('date', flat=True).distinct().order_by('date')

    # Initialize dictionaries to store the latest values for each ticker
    latest_values = {ticker: None for ticker in ['WALCL', 'H41RESPPALDKNWW', 'WLCFLPCL', 'TGA', 'RRPONTSYD']}

    result = []
    for date in all_dates:
        date_values = queryset.filter(date=date)
        
        # Update latest values and calculate sum
        sum_value = 0
        for ticker, multiplier in [('WALCL', 1), ('H41RESPPALDKNWW', 1), ('WLCFLPCL', 1), ('TGA', -1), ('RRPONTSYD', -1)]:
            value = date_values.filter(ticker=ticker).first()
            if value:
                latest_values[ticker] = value.value
            if latest_values[ticker] is not None:
                sum_value += latest_values[ticker] * multiplier
        
        result.append(Series(ticker='LIQUIDITY', date=date, value=sum_value))

    # Save to database
    with transaction.atomic():
        Series.objects.filter(ticker='LIQUIDITY').delete()
        Series.objects.bulk_create(result)

    print("Liquidity data calculated and saved successfully")
