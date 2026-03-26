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

    all_objs = []

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

            all_objs.append(Series(
                ticker=ticker,
                date=date,
                value=int(value * multiplier)
            ))

    Series.objects.bulk_create(
        all_objs,
        batch_size=500,
        update_conflicts=True,
        unique_fields=['ticker', 'date'],
        update_fields=['value']
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

    objs = [
        Series(
            ticker="TGA",
            date=datetime.strptime(item['record_date'], "%Y-%m-%d").date(),
            value=int(float(item['open_today_bal']))
        ) for item in all_data
    ]

    Series.objects.bulk_create(
        objs,
        batch_size=500,
        update_conflicts=True,
        unique_fields=['ticker', 'date'],
        update_fields=['value']
    )
    print("TGA data updated successfully")

def fetch_liquidity_data():
    """Calculate WALCL-TGA-RRPONTSYD+H41RESPPALDKNWW+WLCFLPCL"""
    print("Calculating liquidity data")
    component_tickers = ['WALCL', 'H41RESPPALDKNWW', 'WLCFLPCL', 'TGA', 'RRPONTSYD']

    qs = Series.objects.filter(ticker__in=component_tickers).order_by('date')

    data_by_date = {}
    for item in qs:
        if item.date not in data_by_date:
            data_by_date[item.date] = {}
        data_by_date[item.date][item.ticker] = item.value

    latest_values = {t: 0 for t in component_tickers}
    results = []

    for date in sorted(data_by_date.keys()):
        day_data = data_by_date[date]

        # Update latest values if new data exists for this specific day
        for ticker in component_tickers:
            if ticker in day_data:
                latest_values[ticker] = day_data[ticker]

        # Calculate final metric
        liq_value = (
                latest_values['WALCL'] +
                latest_values['H41RESPPALDKNWW'] +
                latest_values['WLCFLPCL'] -
                latest_values['TGA'] -
                latest_values['RRPONTSYD']
        )

        results.append(Series(ticker='LIQUIDITY', date=date, value=liq_value))

    # Save to database
    with transaction.atomic():
        Series.objects.filter(ticker='LIQUIDITY').delete()
        Series.objects.bulk_create(results, batch_size=500)

    print(f"Liquidity data calculated for {len(results)} dates.")
