from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework_api_key.models import APIKey

from .permissions import HasUserAPIKey, IsFromFrontendOrHasAPIKey

from .models import BitcoinPrice, IndicatorValue, Indicator, Category, DataSource, DataSourceValue, UserAPIKey
from .serializers import BitcoinPriceSerializer, IndicatorValueSerializer, IndicatorSerializer, CategorySerializer, DataSourceSerializer, DataSourceValueSerializer

class BitcoinPriceViewSet(viewsets.ModelViewSet):
    queryset = BitcoinPrice.objects.all()
    serializer_class = BitcoinPriceSerializer

class IndicatorValueViewSet(viewsets.ModelViewSet):
    queryset = IndicatorValue.objects.all()
    serializer_class = IndicatorValueSerializer

class IndicatorViewSet(viewsets.ModelViewSet):
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class DataSourceViewSet(viewsets.ModelViewSet):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer

@api_view(['GET'])
@permission_classes([IsFromFrontendOrHasAPIKey])
def hello(request):
    return Response({"message": "Hello, world!"})

@api_view(['GET'])
def categories_with_indicators(request):
    categories = Category.objects.all()
    data = []
    for category in categories:
        indicators = Indicator.objects.filter(category=category)
        data.append({
            'category': CategorySerializer(category).data,
            'indicators': IndicatorSerializer(indicators, many=True).data
        })
    return Response(data)

@api_view(['GET'])
def get_indicator_by_id(request, id):
    try:
        indicator = Indicator.objects.get(id=id)
        values = IndicatorValue.objects.filter(indicator=indicator).order_by('date')

        indicator_serializer = IndicatorSerializer(indicator)
        values_serializer = IndicatorValueSerializer(values, many=True)

        response_data = {
            "indicator": indicator_serializer.data,
            "values": values_serializer.data
        }

        return Response(response_data)
    except Indicator.DoesNotExist:
        return Response({"error": "Not found."}, status=404)

@api_view(['GET'])
def get_indicator_values(request, indicator_name):
    indicator = Indicator.objects.get(url_name=indicator_name)
    values = IndicatorValue.objects.filter(indicator=indicator).order_by('date')
    serializer = IndicatorValueSerializer(values, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_indicator_by_name(request, indicator_name):
    try:
        indicator = Indicator.objects.get(url_name=indicator_name)
        serializer = IndicatorSerializer(indicator)
        return Response(serializer.data)
    except Indicator.DoesNotExist:
        return Response({"error": "Not found."}, status=404)

@api_view(['GET'])
def get_datasource_by_name(request, datasource_name):
    try:
        datasource = DataSource.objects.get(url=datasource_name)
        serializer = DataSourceSerializer(datasource)
        return Response(serializer.data)
    except DataSource.DoesNotExist:
        return Response({"error": "Not found."}, status=404)

@api_view(['GET'])
def get_datasource_values(request, datasource_name):
    try:
        datasource = DataSource.objects.get(url=datasource_name)
        values = DataSourceValue.objects.filter(data_source=datasource).order_by('date')
        serializer = DataSourceValueSerializer(values, many=True)
        return Response(serializer.data)
    except DataSource.DoesNotExist:
        return Response({"error": "Not found."}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def secret(request):
    user = request.user
    return Response({"message": f"Hello, {user.username}! This is a secret endpoint."})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_api_key(request):
    user = request.user
    has_api_key = UserAPIKey.objects.filter(user=user).exists()
    return Response({"has_api_key": has_api_key})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_api_key(request):
    user = request.user
    existing_key = UserAPIKey.objects.filter(user=user).first()
    if existing_key:
        return Response({"error": "User already has an API key."}, status=400)
    api_key, key = UserAPIKey.objects.create_key(user=user, name=user.username)
    return Response({ "key": key})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_api_key(request):
    user = request.user
    try:
        UserAPIKey.objects.filter(user=user).delete()
        new_api_key, new_key = UserAPIKey.objects.create_key(user=user, name=user.username)
        return Response({ "key": new_key })
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([HasUserAPIKey])
def api_protected(request):
    key = request.META["HTTP_X_API_KEY"]
    api_key = UserAPIKey.objects.get_from_key(key)
    return Response({ "message": f"Congrats on getting API keys to work, key: {key}, username: {api_key} "})
