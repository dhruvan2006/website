from rest_framework_api_key.permissions import BaseHasAPIKey
from .models import UserAPIKey

class HasUserAPIKey(BaseHasAPIKey):
    model = UserAPIKey

from rest_framework.permissions import BasePermission
from django.conf import settings

class IsFromFrontendOrHasAPIKey(BasePermission):
    """
    Custom permission to only allow access to requests from the frontend (Next.js)
    or authenticated users with an API key.
    """

    def has_permission(self, request, view):
        # Check if API key is provided
        api_key = request.META.get('HTTP_X_API_KEY')
        if api_key:
            try:
                UserAPIKey.objects.get_from_key(api_key)
                return True
            except UserAPIKey.DoesNotExist:
                pass
        
        # Check if the request is from the frontend
        custom_header = request.headers.get('X-Frontend-Key')
        if custom_header and custom_header == settings.FRONTEND_KEY:
            return True
        
        # Deny access if neither condition is met
        return False
