# -*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder
from . import data
from django.conf import settings

from . import models


class LoginPopupView(View):
    def get(self, request):
        context = {}
        context['page'] = 'index'
        context['login'] = data.login

        return HttpResponse(json.dumps(context, cls=DjangoJSONEncoder), content_type="application/json")


class CartPopupView(View):
    def get(self, request):
        context = {}
        context['page'] = 'index'
        context['cart'] = data.cart

        return HttpResponse(json.dumps(context, cls=DjangoJSONEncoder), content_type="application/json")
