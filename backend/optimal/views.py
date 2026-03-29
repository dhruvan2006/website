from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import yfinance as yf
import numpy as np
import requests
import math

class OptimalLeverageView(APIView):
    def post(self, request):
        try:
            ticker = request.data.get('ticker')
            start_date = request.data.get('start_date')
            end_date = request.data.get('end_date')
            fees = float(request.data.get('fees', 0))
            lower_lev = float(request.data.get('lower_lev', 0))
            upper_lev = float(request.data.get('upper_lev', 5))

            if not ticker or not start_date or not end_date:
                return Response({"error": "Missing ticker, start_date, or end_date"}, status=status.HTTP_400_BAD_REQUEST)
            
            df = yf.download(ticker, start=start_date, end=end_date, multi_level_index=False)
            df.dropna(inplace=True)

            if df.empty:
                return Response({"error": "No data available for the provided ticker and date range."}, status=status.HTTP_400_BAD_REQUEST)
            
            close_prices = df['Close'].values
            dates = df.index.strftime('%Y-%m-%d').tolist()
            deltas = np.diff(close_prices) / close_prices[:-1]

            mu = np.mean(deltas)
            std = np.std(deltas, ddof=1)

            if np.isnan(mu) or np.isnan(std):
                return Response({"error": "Insufficient data to calculate leverage stats."},
                                status=status.HTTP_400_BAD_REQUEST)

            k = np.linspace(lower_lev, upper_lev, 100)
            R = k * mu - 0.5 * (k ** 2) * (std ** 2) / (1 + k * std)
            R_fees = R - fees / 36500

            max_index = np.argmax(R)

            return Response({
                "ticker": ticker,
                "start_date": start_date,
                "end_date": end_date,
                "fees": fees,
                "lower_lev": lower_lev,
                "upper_lev": upper_lev,
                "k_max": float(k[max_index]),
                "R_max": float(R[max_index]),
                "R": np.nan_to_num(R, nan=0.0).tolist(),
                "R_fees": np.nan_to_num(R_fees, nan=0.0).tolist(),
                "k": k.tolist(),
                "dates": dates,
                "close": close_prices.tolist()
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TickerSuggestionView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        from django.core.cache import cache
        query = request.query_params.get('q', '')

        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"ticker_suggestions_{query}"
        cached_result = cache.get(cache_key)
        if cached_result is not None:
            return Response({"suggestions": cached_result})

        try:
            response = requests.get(f'https://query1.finance.yahoo.com/v1/finance/search?q={query}', headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0'
            })
            data = response.json()
            tickers = [quote['symbol'] for quote in data.get('quotes', [])]
            cache.set(cache_key, tickers, timeout=60*10)  # Cache for 10 minutes
            return Response({"suggestions": tickers})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)