# -*- coding: utf-8 -*-

from django.urls import include, path, re_path
from django.contrib import admin
from django.conf import settings
from django.views.static import serve


urlpatterns = [
    path('dj-admin/', admin.site.urls),
    path('', include(('palmpalm.urls', 'palmpalm'), namespace='front')),
    path('api/', include(('palmpalm.api_urls', 'palmpalm'), namespace='api'))
]

urlpatterns += [
    path('cms/', include(('cms.urls', 'cms'), namespace='cms')),
]


if settings.DEBUG:

    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, 'show_indexes': True})]

    import debug_toolbar
    urlpatterns = [
        re_path(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
