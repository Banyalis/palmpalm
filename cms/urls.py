# -*- coding: utf-8 -*-

from django.urls import path, include, re_path
from tools.various.decorators import login_required_palmpalm, required
from decorator_include import decorator_include
from . import views

urlpatterns = [

    path('', include(('tools.various.public_urls', 'tools.various'), namespace='public')),

    path('', decorator_include(login_required_palmpalm, [
        path('api/', include(('cms.api_urls', 'cms'), namespace='api')),
        path('', views.BaseView.as_view(), name='index'),
    ])),
]
