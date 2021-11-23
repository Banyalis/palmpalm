from django.urls import path, include, re_path

from rest_framework.urlpatterns import format_suffix_patterns
from . import api as views


urlpatterns = format_suffix_patterns([
    re_path(r'^sign-in', views.LoginPopupView.as_view(), name='login-popup'),
    re_path(r'^cart', views.CartPopupView.as_view(), name='cart-popup')
])
