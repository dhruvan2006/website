import ocfinance as of
import pandas as pd
import numpy as np
import yfinance as yf
import os
import json
from dotenv import load_dotenv
from datetime import datetime
from statsmodels.api import OLS, QuantReg, add_constant
from django.core.management.base import BaseCommand

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from indicators.models import BitcoinPrice, Category, DataSource, DataSourceValue, Indicator, IndicatorValue

load_dotenv()

class Command(BaseCommand):
    help = 'Fetch Bitcoin prices and from NasdaqDataLink and Yahoo Finance'

    def handle(self, *args, **options):
        fetch_prices()
        self.stdout.write(self.style.SUCCESS('Successfully fetched Bitcoin prices'))

        fetch_of('Cryptoquant', cryptoquant_indicators, email=os.getenv("CRYPTOQUANT_EMAIL"), password=os.getenv("CRYPTOQUANT_PASSWORD"), proxy=os.getenv("SBR_WEBDRIVER"))
        self.stdout.write(self.style.SUCCESS('Successfully fetched Cryptoquant indicators'))
        fetch_of('CheckOnChain', checkonchain_indicators)
        self.stdout.write(self.style.SUCCESS('Successfully fetched CheckOnChain indicators'))
        fetch_of('ChainExposed', chainexposed_indicators)
        self.stdout.write(self.style.SUCCESS('Successfully fetched ChainExposed indicators'))
        fetch_of('Woocharts', woocharts_indicators)
        self.stdout.write(self.style.SUCCESS('Successfully fetched Woocharts indicators'))
        fetch_of('BiTBO', bitbo_indicators, sbr_webdriver=os.getenv("SBR_WEBDRIVER"))
        self.stdout.write(self.style.SUCCESS('Successfully fetched BiTBO indicators'))

        fetch_indicators()
        self.stdout.write(self.style.SUCCESS('Successfully calculated indicators'))

        # fetch_of('BMPro', bmpro_indicators)
        # self.stdout.write(self.style.SUCCESS('Successfully fetched BMPro indicators'))

def fetch_prices():
    """Fetch Bitcoin prices from Glassnode"""
    # chrome_options = Options()
    # chrome_options.add_argument('--headless')
    # chrome_options.add_argument('--no-sandbox')
    # chrome_options.add_argument('--disable-dev-shm-usage')
    # chrome_options.add_argument('--disable-gpu')
    # chrome_options.add_argument('--window-size=1920,1080')

    # driver = webdriver.Chrome(options=chrome_options)

    # try:
    #     # Gets necessary permissions to access the Data API
    #     driver.get("https://studio.glassnode.com/metrics?a=BTC&m=blockchain.BlockCount")

    #     # Fetch BTC price data
    #     driver.get("https://api.glassnode.com/v1/metrics/market/price_usd_close?a=BTC&i=24h&referrer=charts")
    #     btc_element = driver.find_element(By.TAG_NAME, "pre")
    #     btc_data = btc_element.text

    #     btc_json = json.loads(btc_data)
    #     btc_df = pd.DataFrame(btc_json)
    #     btc_df['t'] = pd.to_datetime(btc_df['t'], unit='s')

    #     # Update or create BitcoinPrice objects
    #     for _, row in btc_df.iterrows():
    #         BitcoinPrice.objects.update_or_create(
    #             date=row['t'].date(),
    #             defaults={'price': row['v']}
    #         )
        
    # Update missing rows with yfinance
    last_db_date = BitcoinPrice.objects.order_by('date').last().date
    today = datetime.today().date()
    if last_db_date < today:
        btc_yahoo = yf.download("BTC-USD", start=last_db_date)
        btc_yahoo.reset_index(inplace=True)

        for _, row in btc_yahoo.iterrows():
            BitcoinPrice.objects.update_or_create(
                date=row['Date'].date(),
                defaults={'price': row['Close']}
                )

    # finally:
    #     driver.quit()

checkonchain_indicators = [
    {
        "url": "https://charts.checkonchain.com/btconchain/pricing/pricing_mvrv_bands/pricing_mvrv_bands_light.html",
        "url_name": "MVRV_Ratio",
        "human_name": "MVRV Ratio",
        "col": "MVRV Ratio",
        "description": """The MVRV Ratio from MVRV Pricing Bands from CheckOnChain
[1] https://charts.checkonchain.com/btconchain/pricing/pricing_mvrv_bands/pricing_mvrv_bands_light.html"""
    },
    {
        "url": "https://charts.checkonchain.com/btconchain/realised/sopr/sopr_light.html",
        "url_name": "SOPR_7D_EMA",
        "human_name": "Spent Output Profit Ratio 7D EMA",
        "col": "SOPR 7D-EMA",
        "description": """The Spent Output Ratio (SOPR) 7D EMA from CheckOnChain
[1] https://charts.checkonchain.com/btconchain/realised/sopr/sopr_light.html"""
    },
    {
        "url": "https://charts.checkonchain.com/btconchain/mining/mining_difficultyperissuance/mining_difficultyperissuance_light.html",
        "url_name": "PoW_OSC",
        "human_name": "Proof of Work Oscillator",
        "col": "PoW Oscillator",
        "description": """The Proof of Work Oscillator from Difficulty per Issuance Model (Estimated Avg Cost of Production) from CheckOnChain
[1] https://charts.checkonchain.com/btconchain/mining/mining_difficultyperissuance/mining_difficultyperissuance_light.html"""
    },
    {
        "url": "https://charts.checkonchain.com/btconchain/cointime/cointime_pricing_mvrv_aviv_1/cointime_pricing_mvrv_aviv_1_light.html",
        "url_name": "AVIV_Ratio",
        "human_name": "AVIV Ratio",
        "col": "AVIV Ratio",
        "description": """The AVIV Ratio from True Market Mean and AVIV Ratio from CheckOnChain
[1] https://charts.checkonchain.com/btconchain/cointime/cointime_pricing_mvrv_aviv_1/cointime_pricing_mvrv_aviv_1_light.html"""
    },
    {
        "url": "https://charts.checkonchain.com/btconchain/pricing/pricing_mayermultiple/pricing_mayermultiple_light.html",
        "url_name": "MAYER_MULT",
        "human_name": "The Mayer Multiple",
        "col": "Mayer Multiple",
        "description": """The Mayer Multiple from CheckOnChain
[1] https://charts.checkonchain.com/btconchain/pricing/pricing_mayermultiple/pricing_mayermultiple_light.html"""
    },
    {
        "url": "https://charts.checkonchain.com/btconchain/pricing/pricing_picycleindicator/pricing_picycleindicator_light.html",
        "url_name": "PI_CYCLE",
        "human_name": "Pi Cycle Top Indicator",
        "col": "Pi Cycle Oscillator",
        "description": """The Pi Cycle Oscillator from Pi Cycle Top Indicator on CheckOnChain
[1] https://charts.checkonchain.com/btconchain/pricing/pricing_picycleindicator/pricing_picycleindicator_light.html"""
    }
]

woocharts_indicators = [
    {
        "url": "https://woocharts.com/bitcoin-macro-oscillator/",
        "url_name": "BTC_Macro_Osc",
        "human_name": "Bitcoin Macro Oscillator",
        "col": "index",
        "description": """The Bitcoin Macro Oscillator indicator from Woocharts
[1] https://woocharts.com/bitcoin-macro-oscillator/"""
    },
    {
        "url": "https://woocharts.com/bitcoin-mvrv-z/",
        "url_name": "MVRV_Z",
        "human_name": "Bitcoin MVRV Z-score",
        "col": "mvrv_z",
        "description": """The Bitcoin MVRV Z-score indicator from Woocharts
[1] https://woocharts.com/bitcoin-mvrv-z/"""
    }
]

chainexposed_indicators = [
    {
        "url": "https://chainexposed.com/MayerMultiple.html",
        "url_name": "Mayer_Multiple",
        "human_name": "Mayer Multiple",
        "col": "Mayer Multiple",
        "description": """The Mayer Multiple indicator from ChainExposed
[1] https://chainexposed.com/MayerMultiple.html"""
    },
    {
        "url": "https://chainexposed.com/NUPL.html",
        "url_name": "NUPL",
        "human_name": "Net Unrealized Profit/Loss (NUPL)",
        "col": "Full NUPL",
        "description": """The Full NUPL from the NUPL indicator from ChainExposed
[1] https://chainexposed.com/NUPL.html"""
    },
    {
        "url": "https://chainexposed.com/RelativeUnrealizedProfit.html",
        "url_name": "RUP",
        "human_name": "Relative Unrealized Profit",
        "col": "RUP",
        "description": """The Relative Unrealized Profit indicator from ChainExposed
[1] https://chainexposed.com/RelativeUnrealizedProfit.html"""
    }
]

bitbo_indicators = [
    {
        "url": "https://charts.bitbo.io/vdd-multiple/",
        "url_name": "VDD_Bitbo",
        "human_name": "Value Days Destroyed",
        "col": "VDD Multiple",
        "description": """The Value Days Destroyed Multiple indicator from BiTBO
[1] https://charts.bitbo.io/vdd-multiple/"""
    },
    {
        "url": "https://charts.bitbo.io/puell-multiple/",
        "url_name": "PUELL_Bitbo",
        "human_name": "The Puell Multiple",
        "col": "The Puell multiple",
        "description": """The Puell Multiple indicator from BiTBO
[1] https://charts.bitbo.io/puell-multiple/"""
    },
    {
        "url": "https://charts.bitbo.io/power-law-oscillator/",
        "url_name": "Power_Law_Osc_Bitbo",
        "human_name": "Power Law Oscillator BiTBO",
        "col": "Oscillator",
        "description": """The Power Law Oscillator indicator from BiTBO
[1] https://charts.bitbo.io/power-law-oscillator/"""
    },
    {
        "url": "https://charts.bitbo.io/sharpe-ratio/",
        "url_name": "Sharpe_Ratio_Bitbo",
        "human_name": "Sharpe Ratio BiTBO",
        "col": "Sharpe ratio",
        "description": """The Sharpe Ratio indicator from BiTBO
[1] https://charts.bitbo.io/sharpe-ratio/"""
    }
]

bmpro_indicators = [
    {
        "url": "https://www.bitcoinmagazinepro.com/charts/puell-multiple/",
        "url_name": "Puell_Multiple_BMPro",
        "human_name": "Puell Multiple",
        "col": "Puell Multiple",
        "description": """Puell Multiple indicator from Bitcoin Magazine PRO
[1] https://www.bitcoinmagazinepro.com/charts/puell-multiple/"""
    },
    {
        "url": "https://www.bitcoinmagazinepro.com/charts/mvrv-zscore/",
        "url_name": "MVRV_ZScore_BMPro",
        "human_name": "MVRV Z-Score",
        "col": "Z-Score",
        "description": """The MVRV Z-Score indicator from Bitcoin Magazine PRO
[1] https://www.bitcoinmagazinepro.com/charts/mvrv-zscore/"""
    },
    {
        "url": "https://www.bitcoinmagazinepro.com/charts/rhodl-ratio/",
        "url_name": "RHODL_Ratio_BMPro",
        "human_name": "RHODL Ratio",
        "col": "RHODL Ratio",
        "description": """The RHODL Ratio indicator from Bitcoin Magazine PRO
[1] https://www.bitcoinmagazinepro.com/charts/rhodl-ratio/"""
    },
    {
        "url": "https://www.bitcoinmagazinepro.com/charts/relative-unrealized-profit--loss/",
        "url_name": "NUPL_BMPro",
        "human_name": "Net Unrealized Profit/Loss (NUPL)",
        "col": "Net Unrealised Profit / Loss (NUPL)",
        "description": """The Net Unrealised Profit / Loss (NUPL) indicator from Bitcoin Magazine PRO
[1] https://www.bitcoinmagazinepro.com/charts/relative-unrealized-profit--loss/"""
    },
    {
        "url": "https://www.bitcoinmagazinepro.com/charts/value-days-destroyed-multiple/",
        "url_name": "VDD_Mult_BMPro",
        "human_name": "Value Days Destroyed (VDD) Multiple",
        "col": "VDD Multiple",
        "description": """The Value Days Destroyed (VDD) Multiple indicator from Bitcoin Magazine PRO
[1] https://www.bitcoinmagazinepro.com/charts/value-days-destroyed-multiple/"""
    }
]

def fetch_of(name, indicators, **kwargs):
    for indicator in indicators:
        print(f"Scraping {indicator['human_name']}...")

        col = indicator['col']

        df = of.download(indicator['url'], **kwargs)

        category, _ = Category.objects.get_or_create(name=name)

        indicator, _ = Indicator.objects.get_or_create(
            url_name=indicator['url_name'],
            defaults={
                'human_name': indicator['human_name'],
                'description': indicator['description'],
                'category': category
            }
        )

        for date, row in df.iterrows():
            if pd.notna(row[col]):
                IndicatorValue.objects.update_or_create(
                    indicator=indicator,
                    date=date,
                    defaults={'value': row[col]}
                )

def fetch_indicators():
    calculate_plrr()
    calculate_vpli()
    calculate_thermocap()
    calculate_decayosc()
    calculate_adjusted_mvrv()
    calculate_adjusted_mayer_multiple()

cryptoquant_indicators = [
    {
        "url": "https://cryptoquant.com/analytics/query/6463b524885a7d37a1630f8b?v=6463f8c9fb92892124bd5864",
        "url_name": "Adjusted_MVRV",
        "human_name": "Adjusted MVRV (Cryptoquant)",
        "col": "Adjusted_MVRV",
        "description": """The Adjusted MVRV indicator from Cryptoquant
[1] https://cryptoquant.com/analytics/query/6463b524885a7d37a1630f8b?v=6494246f2ec8802caadae67f"""
    },
    {
        "url": "https://cryptoquant.com/analytics/query/65fdf974a3be2268b3e0befd?v=65fdfa6203ae7e44ef15d1f8",
        "url_name": "Sharpe_Ratio",
        "human_name": "Sharpe Ratio",
        "col": "sharpe_ratio_365",
        "description": """The Sharpe Ratio indicator from Cryptoquant
[1] https://cryptoquant.com/analytics/query/65fdf974a3be2268b3e0befd?v=65fdfa6203ae7e44ef15d1f8"""
    },
    {
        "url": "https://cryptoquant.com/analytics/query/64faf6ae78b98c08bc94a362?v=64faf723d69757218b557162",
        "url_name": "VDD_Multiple",
        "human_name": "Value Days Destroyed Multiple",
        "col": "VDD_Multiple",
        "description": """The Value Days Destroyed Multiple indicator from Cryptoquant
[1] https://cryptoquant.com/analytics/query/64faf6ae78b98c08bc94a362?v=64faf6ae78b98c08bc94a363"""
    }
]

def fetch_cryptoquant():
    email = os.getenv('CRYPTOQUANT_EMAIL')
    password = os.getenv('CRYPTOQUANT_PASSWORD')

    for indicator in cryptoquant_indicators:
        url = indicator['url']
        col = indicator['col']

        df = of.download(url, email=email, password=password)

        category, _ = Category.objects.get_or_create(name='Cryptoquant')

        indicator, _ = Indicator.objects.get_or_create(
            url_name=indicator['url_name'],
            defaults={
                'human_name': indicator['human_name'],
                'description': indicator['description'],
                'category': category
            }
        )

        for date, row in df.iterrows():
            if pd.notna(row[col]):
                IndicatorValue.objects.update_or_create(
                    indicator=indicator,
                    date=date,
                    defaults={'value': row[col]}
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

# Ensure the category exists
    category, _ = Category.objects.get_or_create(name='Technical')

    # Get the indicator
    indicator, _ = Indicator.objects.get_or_create(
        url_name='PLRR',
        defaults={
            'human_name': 'Power Law Residual Ratio',
            'description': """The Power Law Residual Ratio (PLRR) is an indicator that measures the normalized deviation of price returns from power law growth with respect to volatility. It is designed to help determine when bitcoin is fairly priced and when its under/overvalued.

[1] https://x.com/math_sci_tech/status/1831083600516911566
[2] https://github.com/assridha/Bitcoin-Power-Tools""",
            'category': category
        }
    )

    # Save PLRR to database
    for date, row in df.iterrows():
        if pd.notna(row['PLRR']):
            IndicatorValue.objects.update_or_create(
                indicator=indicator,
                date=date,
                defaults={'value': row['PLRR']}
            )

def calculate_vpli():
    """
    Calculate the Volatility-Adjusted Power Law Index
    [1] https://x.com/Sina_21st/status/1800713784807264431
    """
    # Set parameters
    t0 = '2009-01-03'  # Bitcoin genesis date
    c, m = -40.70389140388637, 6.00728675548973

    # Fetch all prices from db
    prices = BitcoinPrice.objects.all().order_by('date')

    df = pd.DataFrame(list(prices.values()))
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_index(inplace=True)

    t0_datetime = datetime(2009, 1, 3)

    def power_law(x, c, m):
        return np.exp(c) * np.power(x, m)

    df['Days'] = (df.index - t0_datetime).days
    df['Power Law'] = power_law(df['Days'], c, m)
    df['Resids'] = np.log(df['price']) - np.log(df['Power Law'])

    df['LogReturn'] = np.log(df['price']).diff()
    df['LogSDev'] = df['LogReturn'].rolling(365).std()

    df['VPLI'] = df['Resids'] / df['LogSDev']

    # Ensure the category exists
    category, _ = Category.objects.get_or_create(name='Technical')

    # Get the VPLI indicator
    vpli_indicator, _ = Indicator.objects.get_or_create(
        url_name='VPLI',
        defaults={
            'human_name': 'Volatility-adjusted Power Law Indicator',
            'description': """The Volatility-adjusted Power Law Indicator (VPLI) measures the deviation of Bitcoin's price from a fitted power law curve which is adjusted by volatility.

[1] https://x.com/Sina_21st/status/1800713784807264431""",
            'category': category
        }
    )

    # Save VPLI to database
    for date, row in df.iterrows():
        if pd.notna(row['VPLI']):
            IndicatorValue.objects.update_or_create(
                indicator=vpli_indicator,
                date=date,
                defaults={'value': row['VPLI']}
            )

def calculate_thermocap():
    """
    Calculate the Thermocap Multiple
    [1] https://charts.bitbo.io/thermocap-multiple/
    [2] https://www.tradingview.com/script/WdnPvtn7-Bitcoin-Thermocap-InvestorUnknown/
    """
    # Set parameters
    ma_len = 365

    # Fetch all prices from db
    prices = BitcoinPrice.objects.all().order_by('date')

    df = pd.DataFrame(list(prices.values()))
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_index(inplace=True)

    # Fetch block count data
    block_count_source = DataSource.objects.get(url='BLOCK_COUNT')
    block_count_data = DataSourceValue.objects.filter(data_source=block_count_source).order_by('date')

    block_count_df = pd.DataFrame(list(block_count_data.values()))
    block_count_df['date'] = pd.to_datetime(block_count_df['date'])
    block_count_df.set_index('date', inplace=True)
    block_count_df.sort_index(inplace=True)

    # Merge price and block count data
    df = df.join(block_count_df['value'], how='outer')
    df.rename(columns={'value': 'Blocks_Mined'}, inplace=True)

    # Calculate Thermocap
    df['Historical_Blocks'] = (df['Blocks_Mined'] * df['price']).cumsum()
    df['Thermocap'] = (df['price'] / df['Historical_Blocks']) * 1000000  # multiple by 1000000 just to make it look nicer
    df['Thermocap_Log'] = np.log(df['Thermocap'])

    # Calculate EMA
    df['MA'] = df['Thermocap_Log'].ewm(span=ma_len, adjust=False).mean()

    # Calculate Oscillator
    df['MA_Oscillator'] = df['Thermocap_Log'] / df['MA']

    # Ensure the category exists
    category, _ = Category.objects.get_or_create(name='On-Chain')

    # Get the Thermocap indicator
    thermocap_indicator, _ = Indicator.objects.get_or_create(
        url_name='THERMOCAP',
        defaults={
            'human_name': 'Thermocap Multiple',
            'description': """The Thermocap multiple chart displays the ratio between the cumulative mined BTC (the block subsidy) and denominates them in USD, starting from day one and up to the given day.

[1] https://charts.bitbo.io/thermocap-multiple/
[2] https://www.tradingview.com/script/WdnPvtn7-Bitcoin-Thermocap-InvestorUnknown/""",
            'category': category
        }
    )

    # Save Thermocap to database
    for date, row in df.iterrows():
        if pd.notna(row['MA_Oscillator']):
            value = row['MA_Oscillator']
            if np.isinf(value):
                # Log the infinite value
                print(f"Warning: Infinite value encountered for date {date}. Deleting entry.")
                # Delete the entry if it exists
                IndicatorValue.objects.filter(
                    indicator=thermocap_indicator,
                    date=date
                ).delete()
            else:
                IndicatorValue.objects.update_or_create(
                    indicator=thermocap_indicator,
                    date=date,
                    defaults={'value': value}
                )

def calculate_decayosc():
    """
    Calculate the Bitcoin Decay Oscillator
    [1] https://x.com/sminston_with/status/1813619486106558647
    """
    prices = BitcoinPrice.objects.all().order_by('date')
    df = pd.DataFrame(list(prices.values()))
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_index(inplace=True)

    t0_datetime = datetime(2009, 1, 3)
    df['Days'] = (df.index - t0_datetime).days

    # Clean data
    df = df.replace([np.inf, -np.inf], np.nan).dropna() # Remove inf values
    df = df[(df['price'] > 0) & (df['Days'] > 0)] # Remove days and prices less than 0

    X = np.log(df['Days']).values.reshape(-1, 1)
    y = np.log(df['price']).values

    # Power law fit
    X_with_const = add_constant(X)
    model_power_law = OLS(y, X_with_const)
    results_power_law = model_power_law.fit()

    # Quadratic fit
    X_log_squared = np.vander(X.ravel(), 3)
    X_log_squared_with_const = add_constant(X_log_squared)
    model_quadratic = QuantReg(y, X_log_squared_with_const)
    results_quadratic = model_quadratic.fit(q=0.999)

    # Calculate predictions
    y_pred_power_law = results_power_law.predict(X_with_const) - 0.95
    y_pred_quadratic = results_quadratic.predict(X_log_squared_with_const)

    df['Oscillator'] = (y - y_pred_power_law) / (y_pred_quadratic - y_pred_power_law)

    # Save to database
    category, _ = Category.objects.get_or_create(name='Technical')

    indicator, _ = Indicator.objects.get_or_create(
        url_name='DECAYOSC',
        defaults={
            'human_name': 'Bitcoin Decay Oscillator',
            'description': """The Bitcoin Decay Oscillator measures the deviation of Bitcoin's price from a power law support fit and a quadratic fit for the tops.
[1] https://x.com/sminston_with/status/1813619486106558647
""",
            'category': category
        }
    )

    for date, row in df.iterrows():
        if pd.notna(row['Oscillator']):
            IndicatorValue.objects.update_or_create(
                indicator=indicator,
                date=date,
                defaults={'value': row['Oscillator']}
            )

def calculate_adjusted_mvrv():
    """
    Calculate my Adjusted MVRV, which is an oscillator of raw MVRV between two linear regressions
    """
    prices = BitcoinPrice.objects.all().order_by('date')
    df = pd.DataFrame(list(prices.values()))
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_index(inplace=True)

    mvrv_source = DataSource.objects.get(url='MVRV')
    mvrv_data = DataSourceValue.objects.filter(data_source=mvrv_source).order_by('date')

    mvrv_df = pd.DataFrame(list(mvrv_data.values()))
    mvrv_df['date'] = pd.to_datetime(mvrv_df['date'])
    mvrv_df.set_index('date', inplace=True)
    mvrv_df.sort_index(inplace=True)

    df = df.join(mvrv_df['value'], how='inner')
    df.rename(columns={'value': 'MVRV'}, inplace=True)

    # Calculate linear regressions
    t0 = df.index.min()
    X = (df.index - t0).days.values.reshape(-1, 1)
    y = df['MVRV'].values

    X_with_const = add_constant(X)

    top = QuantReg(y, X_with_const)
    res_top = top.fit(q=0.999)

    bottom = QuantReg(y, X_with_const)
    res_bottom = bottom.fit(q=0.005)

    df['MVRV_Top'] = res_top.predict(X_with_const)
    df['MVRV_Bottom'] = res_bottom.predict(X_with_const)

    df['Adjusted_MVRV'] = (df['MVRV'] - df['MVRV_Bottom']) / (df['MVRV_Top'] - df['MVRV_Bottom'])
    df['Adjusted_MVRV'] = np.log(df['Adjusted_MVRV'] + 0.15)

    # Save to database
    category, _ = Category.objects.get_or_create(name='On-Chain')

    indicator, _ = Indicator.objects.get_or_create(
        url_name='ADJUSTED_MVRV',
        defaults={
            'human_name': 'Adjusted MVRV',
            'description': """The Adjusted MVRV is an oscillator of raw MVRV between two quantile linear regressions, one for the top and one for the bottom.""",
            'category': category
        }
    )

    for date, row in df.iterrows():
        if pd.notna(row['Adjusted_MVRV']):
            IndicatorValue.objects.update_or_create(
                indicator=indicator,
                date=date,
                defaults={'value': row['Adjusted_MVRV']}
            )

def calculate_adjusted_mayer_multiple():
    """
    Calculate the Adjusted Mayer Multiple, which is an oscillator of Mayer Multiple between two quantile regressions.
    """
    mayer_indicator = Indicator.objects.get(url_name='MAYER_MULT')
    mayer_values = IndicatorValue.objects.filter(indicator=mayer_indicator).order_by('date')

    # Convert data to df
    mayer_df = pd.DataFrame(list(mayer_values.values()))
    mayer_df['date'] = pd.to_datetime(mayer_df['date'])
    mayer_df.set_index('date', inplace=True)
    mayer_df.sort_index(inplace=True)

    # Calculate quantile regressions
    start_date = mayer_df.index.min()
    X = (mayer_df.index - start_date).days.values.reshape(-1, 1)
    y = np.log(mayer_df['value'].values)

    X_with_const = add_constant(X)

    model_bottom = QuantReg(y, X_with_const)
    res_bottom = model_bottom.fit(q=0.01)

    model_top = QuantReg(y, X_with_const)
    res_top = model_top.fit(q=0.99)

    mayer_df['Mayer Multiple Bottom'] = res_bottom.predict(X_with_const)
    mayer_df['Mayer Multiple Top'] = res_top.predict(X_with_const)

    mayer_df['Adjusted Mayer Multiple'] = (y - mayer_df['Mayer Multiple Bottom']) / (mayer_df['Mayer Multiple Top'] - mayer_df['Mayer Multiple Bottom'])

    category, _ = Category.objects.get_or_create(name='Technical')

    indicator, _ = Indicator.objects.get_or_create(
        url_name='ADJUSTED_MAYER_MULTIPLE',
        defaults={
            'human_name': 'Adjusted Mayer Multiple',
            'description': """The Adjusted Mayer Multiple is an oscillator of the raw Mayer Multiple between two quantile linear regressions.
[1] https://chainexposed.com/MayerMultiple.html
[2] https://www.gnanadhandayuthapani.com/notebooks/adjusted-mayer-multiple
[3] https://www.gnanadhandayuthapani.com/indicators/Mayer_Multiple""",
            'category': category
        }
    )

    for date, row in mayer_df.iterrows():
        if pd.notna(row['Adjusted Mayer Multiple']):
            IndicatorValue.objects.update_or_create(
                indicator=indicator,
                date=date,
                defaults={'value': row['Adjusted Mayer Multiple']}
            )
