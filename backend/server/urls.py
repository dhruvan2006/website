"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls
from . import views

urlpatterns = [
    path(r"^accounts", include("allauth.urls")),
    path('', views.index),
    path('auth/', include('authentication.urls')),
    path('api/liquidity/', include('liquidity.urls')),
    path('api/indicators/', include('indicators.urls')),
    path('api/research/', include('research.urls')),
    path('api/optimal/', include('optimal.urls')),
    path('api/valuation/', include('valuation.urls')),
    path('api/speedometer/', include('speedometer.urls')),
    path('admin/', admin.site.urls),
] + debug_toolbar_urls()
