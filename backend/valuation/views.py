from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Valuation, ValuationIndicator
from .serializers import ValuationSerializer, ValuationIndicatorSerializer

class ValuationView(APIView):
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def get(self, request):
        valuations = Valuation.objects.all().order_by('date')
        indicators = ValuationIndicator.objects.all()

        valuation_data = ValuationSerializer(valuations, many=True).data
        indicator_data = ValuationIndicatorSerializer(indicators, many=True).data

        response_data = {
            "valuation": valuation_data,
            "indicators": indicator_data
        }

        return Response(response_data)
