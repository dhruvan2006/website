import chaindl
import pandas as pd
import numpy as np
import yfinance as yf
from dotenv import load_dotenv
from datetime import datetime
from statsmodels.api import OLS, QuantReg, add_constant
from django.core.management.base import BaseCommand

from indicators.models import BitcoinPrice, Category, DataSource, DataSourceValue, Indicator, IndicatorValue

load_dotenv()

class Command(BaseCommand):
    help = 'Fetch Bitcoin prices and from NasdaqDataLink and Yahoo Finance'

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

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.price_df = None

    def handle(self, *args, **options):
        self.fetch_prices()
        self.stdout.write(self.style.SUCCESS('Successfully fetched Bitcoin prices'))

        self.stdout.write("Caching price data in memory...")
        self.price_df = self._load_price_data()
        if self.price_df is None:
            self.stderr.write(self.style.ERROR("No price data available. Aborting internal calculations."))
            return

        self.fetch_of('CheckOnChain', self.checkonchain_indicators)
        self.stdout.write(self.style.SUCCESS('Successfully fetched CheckOnChain indicators'))
        self.fetch_of('ChainExposed', self.chainexposed_indicators)
        self.stdout.write(self.style.SUCCESS('Successfully fetched ChainExposed indicators'))
        self.fetch_of('Woocharts', self.woocharts_indicators)
        self.stdout.write(self.style.SUCCESS('Successfully fetched Woocharts indicators'))
        self.fetch_of('BiTBO', self.bitbo_indicators, xvfb=True)
        self.stdout.write(self.style.SUCCESS('Successfully fetched BiTBO indicators'))
        self.fetch_of('BMPro', self.bmpro_indicators, xvfb=True)
        self.stdout.write(self.style.SUCCESS('Successfully fetched BMPro indicators'))

        # Internal calculations
        self.calculate_plrr()
        self.calculate_vpli()
        self.calculate_thermocap()
        self.calculate_decayosc()
        self.calculate_adjusted_mvrv()
        self.calculate_adjusted_mayer_multiple()

        self.stdout.write(self.style.SUCCESS('Successfully calculated indicators'))


    def fetch_prices(self):
        """Fetch Bitcoin prices from Yahoo Finance"""
        last_entry = BitcoinPrice.objects.order_by('date').last()
        last_db_date = last_entry.date if last_entry else None
        today = datetime.today().date()

        if not last_db_date or last_db_date < today:
            start_date = last_db_date if last_db_date else "1900-01-01"

            try:
                btc_yahoo = yf.download("BTC-USD", start=start_date, multi_level_index=False)
                if btc_yahoo.empty:
                    self.stderr.write(self.style.WARNING("No new price data found on yfinance."))
                    return
                btc_yahoo.reset_index(inplace=True)

                price_objs = [
                    BitcoinPrice(date=row['Date'].date(), price=row['Close'])
                    for _, row in btc_yahoo.iterrows()
                ]

                BitcoinPrice.objects.bulk_create(
                    price_objs,
                    update_conflicts=True,
                    unique_fields=['date'],
                    update_fields=['price']
                )
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Failed to fetch prices from yfinance: {e}"))

    def fetch_of(self, name, indicators, **kwargs):
        for ind_meta in indicators:
            self.stdout.write(f"Scraping {ind_meta['human_name']}...")

            col = ind_meta['col']

            try:
                df = chaindl.download(ind_meta['url'], **kwargs)

                if df is None or df.empty:
                    self.stderr.write(self.style.WARNING(f"Warning: No data returned for {ind_meta['human_name']}. "
                                                         f"Skipping."))
                    continue

                if col not in df.columns:
                    self.stderr.write(
                        self.style.ERROR(f"Error: Column '{col}' not found for {ind_meta['human_name']}."))
                    self.stderr.write(self.style.NOTICE(f"Available columns: {df.columns.tolist()}"))
                    continue
            except ValueError as e:
                self.stderr.write(self.style.ERROR(f"ValueError scraping {ind_meta['human_name']}: {e}"))
                continue
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Unexpected error for {ind_meta['human_name']}: {e}"))
                continue

            category, _ = Category.objects.get_or_create(name=name)

            indicator_obj, _ = Indicator.objects.get_or_create(
                url_name=ind_meta['url_name'],
                defaults={
                    'human_name': ind_meta['human_name'],
                    'description': ind_meta['description'],
                    'category': category
                }
            )

            # Clean the dataframe
            df.index = pd.to_datetime(df.index).date
            df = df[df[col].notna()]
            df = df[~df.index.duplicated(keep='last')]

            objs = [
                IndicatorValue(
                    indicator=indicator_obj,
                    date=date,
                    value=row[col]
                ) for date, row in df.iterrows()
            ]

            IndicatorValue.objects.bulk_create(
                objs,
                batch_size=1000,
                update_conflicts=True,
                unique_fields=['indicator', 'date'],
                update_fields=['value']
            )

    def _load_price_data(self):
        prices = BitcoinPrice.objects.all().order_by('date')
        if not prices.exists():
            return None
        df = pd.DataFrame(list(prices.values('date', 'price')))
        df['date'] = pd.to_datetime(df['date'])
        return df.set_index('date').sort_index()

    def _get_price_df(self):
        return self.price_df

    def _save_metric(self, df, col, url_name, human_name, cat_name, desc):
        """Handles unique logic for cleaning and bulk creating calculated values"""
        category, _ = Category.objects.get_or_create(name=cat_name)
        indicator, _ = Indicator.objects.get_or_create(
            url_name=url_name,
            defaults={'human_name': human_name, 'description': desc, 'category': category}
        )
        df_clean = df.replace([np.inf, -np.inf], np.nan).dropna(subset=[col]).copy()
        df_clean.index = df_clean.index.date
        df_clean = df_clean[~df_clean.index.duplicated(keep='last')]

        objs = [IndicatorValue(indicator=indicator, date=date, value=row[col]) for date, row in df_clean.iterrows()]
        IndicatorValue.objects.bulk_create(objs, batch_size=1000, update_conflicts=True,
                                           unique_fields=['indicator', 'date'], update_fields=['value'])

    def calculate_plrr(self):
        """
        Calculate the power law oscillator
        [1] https://x.com/math_sci_tech/status/1831083600516911566
        [2] https://github.com/assridha/Bitcoin-Power-Tools/tree/main
        """
        self.stdout.write("Calculating PLRR...")

        # Set parameters
        t0_datetime = datetime(2009, 1, 3) # Bitcoin genesis date
        k_PL = 5.7  # Power law exponent
        T_span = 365  # Span for PLRR
        risk_free_return = 0

        try:
            # Fetch all prices from db
            df = self._get_price_df().copy()
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
            df['PLRR'] = np.sqrt(T_span) * (df['MeanLogReturn'] - k_PL * df['MeanLogTimeDiff'] - (1 / 365) * np.log(
                1 + risk_free_return / 100)) / df['LogSDev']

            desc = """The Power Law Residual Ratio (PLRR) is an indicator that measures the normalized deviation of price returns from power law growth with respect to volatility. It is designed to help determine when bitcoin is fairly priced and when its under/overvalued.
    
        [1] https://x.com/math_sci_tech/status/1831083600516911566
        [2] https://github.com/assridha/Bitcoin-Power-Tools"""

            self._save_metric(df, 'PLRR', 'PLRR', 'Power Law Residual Ratio', 'Technical', desc)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"PLRR Calculation Error: {e}"))

    def calculate_vpli(self):
        """
        Calculate the Volatility-Adjusted Power Law Index
        [1] https://x.com/Sina_21st/status/1800713784807264431
        """
        self.stdout.write("Calculating VPLI...")

        # Set parameters
        t0_datetime = datetime(2009, 1, 3)
        # Bitcoin genesis date
        c, m = -40.70389140388637, 6.00728675548973

        try:
            # Fetch all prices from db
            df = self._get_price_df().copy()

            def power_law(x, c, m):
                return np.exp(c) * np.power(x, m)

            df['Days'] = (df.index - t0_datetime).days
            df['Power Law'] = power_law(df['Days'], c, m)
            df['Resids'] = np.log(df['price']) - np.log(df['Power Law'])

            df['LogReturn'] = np.log(df['price']).diff()
            df['LogSDev'] = df['LogReturn'].rolling(365).std()

            df['VPLI'] = df['Resids'] / df['LogSDev']

            desc = """The Volatility-adjusted Power Law Indicator (VPLI) measures the deviation of Bitcoin's price from a fitted power law curve which is adjusted by volatility.
    
        [1] https://x.com/Sina_21st/status/1800713784807264431"""

            self._save_metric(df, 'VPLI', 'VPLI', 'Volatility-adjusted Power Law Indicator', 'Technical', desc)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"VPLI Calculation Error: {e}"))

    def calculate_thermocap(self):
        """
        Calculate the Thermocap Multiple
        [1] https://charts.bitbo.io/thermocap-multiple/
        [2] https://www.tradingview.com/script/WdnPvtn7-Bitcoin-Thermocap-InvestorUnknown/
        """
        self.stdout.write("Calculating Thermocap Multiple...")

        # Set parameters
        ma_len = 365

        try:
            source = DataSource.objects.get(url='BLOCK_COUNT')
            bc_data = pd.DataFrame(list(DataSourceValue.objects.filter(data_source=source).values('date', 'value')))
            if bc_data.empty: raise ValueError("No Block Count data.")

            bc_data['date'] = pd.to_datetime(bc_data['date'])
            df = self._get_price_df().join(bc_data.set_index('date')['value'], how='inner').rename(
                columns={'value': 'Blocks_Mined'})

            # Calculate Thermocap
            df['Historical_Blocks'] = (df['Blocks_Mined'] * df['price']).cumsum()
            df['Thermocap'] = (df['price'] / df[
                'Historical_Blocks']) * 1000000  # multiply by 1000000 just to make it look nicer
            df['Thermocap_Log'] = np.log(df['Thermocap'])

            # Calculate EMA
            df['MA'] = df['Thermocap_Log'].ewm(span=ma_len, adjust=False).mean()

            # Calculate Oscillator
            df['MA_Oscillator'] = df['Thermocap_Log'] / df['MA']

            desc = """The Thermocap multiple chart displays the ratio between the cumulative mined BTC (the block subsidy) and denominates them in USD, starting from day one and up to the given day.
    
        [1] https://charts.bitbo.io/thermocap-multiple/
        [2] https://www.tradingview.com/script/WdnPvtn7-Bitcoin-Thermocap-InvestorUnknown/"""

            self._save_metric(df, 'MA_Oscillator', 'THERMOCAP', 'Thermocap Multiple', 'On-Chain', desc)

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Thermocap Calculation Error: {e}"))

    def calculate_decayosc(self):
        """
        Calculate the Bitcoin Decay Oscillator
        [1] https://x.com/sminston_with/status/1813619486106558647
        """
        self.stdout.write("Calculating Decay Oscillator...")

        t0_datetime = datetime(2009, 1, 3)

        try:
            df = self._get_price_df().copy()
            df['Days'] = (df.index - t0_datetime).days
            df = df.replace([np.inf, -np.inf], np.nan).dropna()  # Remove inf values
            df = df[(df['price'] > 0) & (df['Days'] > 0)]  # Remove days and prices less than 0

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

            desc = """The Bitcoin Decay Oscillator measures the deviation of Bitcoin's price from a power law support fit and a quadratic fit for the tops.

        [1] https://x.com/sminston_with/status/1813619486106558647"""

            self._save_metric(df, 'Oscillator', 'DECAYOSC', 'Bitcoin Decay Oscillator', 'Technical', desc)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Decay Oscillator Calculation Error: {e}"))

    def calculate_adjusted_mvrv(self):
        """
        Calculate my Adjusted MVRV, which is an oscillator of raw MVRV between two linear regressions
        """
        self.stdout.write("Calculating Adjusted MVRV...")

        try:
            m_src = DataSource.objects.get(url='MVRV')
            m_data = pd.DataFrame(list(DataSourceValue.objects.filter(data_source=m_src).values('date', 'value')))
            if m_data.empty: raise ValueError("No MVRV data.")

            m_data['date'] = pd.to_datetime(m_data['date'])
            df = self._get_price_df().join(m_data.set_index('date')['value'], how='inner').rename(
                columns={'value': 'MVRV'})

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

            desc = """The Adjusted MVRV is an oscillator of raw MVRV between two quantile linear regressions, one for the top and one for the bottom."""

            self._save_metric(df, 'Adjusted_MVRV', 'ADJUSTED_MVRV', 'Adjusted MVRV', 'On-Chain', desc)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Adjusted MVRV Calculation Error: {e}"))

    def calculate_adjusted_mayer_multiple(self):
        """
        Calculate the Adjusted Mayer Multiple, which is an oscillator of Mayer Multiple between two quantile regressions.
        """
        self.stdout.write("Calculating Adjusted Mayer Multiple...")

        try:
            m_ind = Indicator.objects.get(url_name='MAYER_MULT')
            df = pd.DataFrame(list(IndicatorValue.objects.filter(indicator=m_ind).values('date', 'value')))
            if df.empty: raise ValueError("No Mayer Multiple values.")

            df['date'] = pd.to_datetime(df['date'])
            df.set_index('date', inplace=True)
            df.sort_index(inplace=True)

            # Calculate quantile regressions
            start_date = df.index.min()
            X = (df.index - start_date).days.values.reshape(-1, 1)
            y = np.log(df['value'].values)

            X_with_const = add_constant(X)

            model_bottom = QuantReg(y, X_with_const)
            res_bottom = model_bottom.fit(q=0.01)

            model_top = QuantReg(y, X_with_const)
            res_top = model_top.fit(q=0.99)

            df['Mayer Multiple Bottom'] = res_bottom.predict(X_with_const)
            df['Mayer Multiple Top'] = res_top.predict(X_with_const)

            df['Adjusted Mayer Multiple'] = (y - df['Mayer Multiple Bottom']) / (
                        df['Mayer Multiple Top'] - df['Mayer Multiple Bottom'])

            desc = """The Adjusted Mayer Multiple is an oscillator of the raw Mayer Multiple between two quantile linear regressions.
        [1] https://chainexposed.com/MayerMultiple.html
        [2] https://crypto.dhruvan.dev/notebooks/adjusted-mayer-multiple
        [3] https://crypto.dhruvan.dev/indicators/Mayer_Multiple"""

            self._save_metric(df, 'Adjusted Mayer Multiple', 'ADJUSTED_MAYER_MULTIPLE', 'Adjusted Mayer Multiple', 'Technical', desc)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Adjusted Mayer Multiple Calculation Error: {e}"))
