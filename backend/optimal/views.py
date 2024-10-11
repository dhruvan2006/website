from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import yfinance as yf
import numpy as np
import requests

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
            
            df = yf.download(ticker, start=start_date, end=end_date)

            if df.empty:
                return Response({"error": "No data available for the provided ticker and date range."}, status=status.HTTP_400_BAD_REQUEST)
            
            close_prices = df['Close'].values
            dates = df.index.values
            deltas = np.diff(close_prices) / close_prices[:-1]

            mu = np.mean(deltas)
            std = np.std(deltas, ddof=1)

            k = np.linspace(lower_lev, upper_lev, 100)
            R = k * mu - 0.5 * (k ** 2) * (std ** 2) / (1 + k * std)
            R_fees = R - fees / 36500

            max_index = np.argmax(R)
            k_max = k[max_index]
            R_max = R[max_index]
            
            return Response({
                "ticker":  ticker,
                "start_date": start_date,
                "end_date": end_date,
                "fees": fees,
                "lower_lev": lower_lev,
                "upper_lev": upper_lev,
                "k_max": k_max,
                "R_max": R_max,
                "R": R,
                "R_fees": R_fees.tolist(),
                "k": k,
                "dates": dates,
                "close": close_prices
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TickerSuggestionView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        query = request.query_params.get('q', '')

        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            response = requests.get(f'https://query1.finance.yahoo.com/v1/finance/search?q={query}', headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0'
            })
            data = response.json()
            tickers = [quote['symbol'] for quote in data.get('quotes', [])]

            return Response({"suggestions": tickers})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)