from django.urls import path

from . import views

urlpatterns = [
    path('logout/', views.user_logout, name='logout'),
    path('api/auth/', views.user_login_api, name='login'),
]
