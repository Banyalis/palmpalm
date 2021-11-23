from django.conf.urls import url

from . import views

urlpatterns = [
url(r'^logout/$', views.user_logout, name='logout'),
]
