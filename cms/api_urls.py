# -*- coding: utf-8 -*-

from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns


router = DefaultRouter()

urlpatterns = [
    path('files/', include(('tools.files.urls', 'tools.files'), namespace='files')),
]

urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns += [
    path('', include(router.urls)),
]
