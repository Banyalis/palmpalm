# -*- coding: utf-8 -*-

from django.contrib.auth import logout, authenticate, login
from django.views.generic import TemplateView
from django.views import View
from django.urls import reverse
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden, Http404
from django.utils.cache import patch_response_headers
from django.shortcuts import render
from datetime import date
import json
# import requests
from django.conf import settings


def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
    return HttpResponseRedirect(reverse('cms:index'))


def user_login(request, view_func, *args, **kwargs):
    if request.user.is_authenticated:
        return view_func(request, *args, **kwargs)
    state = ""
    if request.method == 'POST':
        login = request.POST.get('login')
        password = request.POST.get('pwd')
        user = authenticate(username=login, password=password)
        if user is None or not user.is_active:
            state = "Your username and/or password were incorrect."
        else:
            login(request, user)
            request.method = 'GET'
            # return view_func(request, *args, **kwargs)
            return HttpResponseRedirect(request.get_full_path())
    return render(request, 'control/Login.jinja')


def user_login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('login')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is None or not user.is_active:
            return HttpResponseForbidden(json.dumps({'status': False, 'error': 'Wrong user or password'}), content_type='application/json')
        else:
            login(request, user)
            return HttpResponse(json.dumps({'status': True}), content_type='application/json')
    return HttpResponse(json.dumps({'status': False, 'error': 'Invalid method, please try later.'}), content_type='application/json', status=405)
