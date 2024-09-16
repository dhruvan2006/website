from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView
from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView

from .views import GoogleLogin, GitHubLogin, GitLabLogin

urlpatterns = [
    # path("register/", RegisterView.as_view(), name="rest_register"),
    # path("login/", LoginView.as_view(), name="rest_login"),
    # path("logout/", LogoutView.as_view(), name="rest_logout"),
    # path("user/", UserDetailsView.as_view(), name="rest_user_details"),
    # path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path('', include('dj_rest_auth.urls')),
    path('register/', include('dj_rest_auth.registration.urls')),

    path("google/", GoogleLogin.as_view(), name="google_login"),
    path("github/", GitHubLogin.as_view(), name="github_login"),
    path("gitlab/", GitLabLogin.as_view(), name="gitlab_login"),
]
