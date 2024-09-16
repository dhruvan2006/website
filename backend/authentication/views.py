from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.gitlab.views import GitLabOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import UserDetailsView as DefaultUserDetailsView
from rest_framework import serializers
from django.contrib.auth.models import User

class UserDetailsSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'first_name', 'last_name', 'profile_photo')
        read_only_fields = ('email',)

    def get_profile_photo(self, obj):
        return obj.profile.profile_photo if hasattr(obj, 'profile') else None

class UserDetailsView(DefaultUserDetailsView):
    serializer_class = UserDetailsSerializer

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/accounts/google/login/callback/"
    client_class = OAuth2Client

class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/accounts/github/login/callback/"
    client_class = OAuth2Client

class GitLabLogin(SocialLoginView):
    adapter_class = GitLabOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/accounts/gitlab/login/callback/"
    client_class = OAuth2Client
