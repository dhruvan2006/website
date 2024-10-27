import ssl
from OpenSSL import crypto
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from .models import Ticker, TickerScore
from .serializers import TickerSerializer, TickerScoreSerializer

class TickerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ticker.objects.all()
    serializer_class = TickerSerializer

class TickerScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TickerScore.objects.all()
    serializer_class = TickerScoreSerializer

class WebhookAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        cert = request.META.get('SSL_CLIENT_CERT')
        # if not cert:
        #     return Response({"error": "No client certificate provided"}, status=status.HTTP_403_FORBIDDEN)

        # if not self._validate_certificate(cert):
        #     return Response({"error": "Unauthorized client certificate"}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        validation_error = self._validate_data(data)
        if validation_error:
            return validation_error

        ticker_score = self._save_score(data)
        
        ticker_score_data = TickerScoreSerializer(ticker_score).data
        return Response(ticker_score_data, status=status.HTTP_201_CREATED)

    def _validate_certificate(self, cert):
        try:
            x509 = crypto.load_certificate(crypto.FILETYPE_PEM, cert)
            subject = dict(x509.get_subject().get_components())
            subject_alt_names = [
                alt.decode() for alt in x509.get_extension(
                    crypto.X509Extension.subjectAltName, 0).get_data().split(b',')
            ]

            valid_subject = (
                subject.get(b'C') == b'US' and
                subject.get(b'ST') == b'Ohio' and
                subject.get(b'L') == b'Westerville' and
                subject.get(b'O') == b'TradingView, Inc.' and
                subject.get(b'CN') == b'webhook-server@tradingview.com' and
                "email:webhook-server@tradingview.com" in subject_alt_names
            )

            return valid_subject
        except Exception as e:
            return False

    def _validate_data(self, data):
        required_fields = ["ticker", "date", "score"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
        return None

    def _save_score(self, data):
        ticker_symbol = data.get("ticker")
        date = data.get("date")
        score = data.get("score")

        ticker, _ = Ticker.objects.get_or_create(ticker=ticker_symbol)
        existing_score = TickerScore.objects.filter(
            ticker=ticker,
            date=date
        ).first()

        if existing_score:
            if existing_score.score == score:
                # If score is the same, return existing record
                return existing_score
            else:
                # If score is different, update the existing record
                existing_score.score = score
                existing_score.save()
                return existing_score

        # If no existing score found, create a new one
        return TickerScore.objects.create(ticker=ticker, date=date, score=score)
