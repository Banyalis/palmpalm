# -*- coding: utf-8 -*-

from django.conf import settings
from django.urls import path, include, re_path
from . import views


urlpatterns = [
    re_path(r'^$', views.IndexView.as_view(), name='index'),
    re_path(r'^sign-in/$', views.LoginPopupView.as_view(), name='login-popup'),
    re_path(r'^cart/$', views.CartPopupView.as_view(), name='cart-popup'),
    re_path(r'^checkout/$', views.CheckoutView.as_view(), name='checkout'),
    re_path(r'^blog/$', views.BlogView.as_view(), name='blog'),
    re_path(r'^blog/(?P<slug>[\w-]+)/$', views.BlogArticleView.as_view(), name='blog-article'),

    path('api/', include(('palmpalm.api_urls', 'front'), namespace='api'))
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^404$', views.Custom404View.as_view(), name='404'),
    ]
