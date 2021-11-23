# -*- coding: utf-8 -*-

from django.views.generic import TemplateView
from django.http import Http404, HttpResponseRedirect, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.conf.urls.static import static
from django.conf import settings

from . import data, models


class BaseView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)

        context['header'] = data.header
        context['footer'] = data.footer
        context['social'] = data.social
        context['products'] = data.products

        return context


class IndexView(BaseView):
    template_name = 'front/pages/Index/Index.jinja'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)

        context['OG'] = data.index['OG']
        context['data'] = data.index

        return context

class LoginPopupView(IndexView):
    template_name = 'front/pages/LoginPopup/LoginPage.jinja'

    def get_context_data(self, **kwargs):
        context = super(LoginPopupView, self).get_context_data(**kwargs)

        context['page'] = 'index'
        context['login'] = data.login
        # context['popup'] = {'state': 'login'}

        return context

class CartPopupView(IndexView):
    template_name = 'front/pages/CartPopup/CartPage.jinja'

    def get_context_data(self, **kwargs):
        context = super(CartPopupView, self).get_context_data(**kwargs)

        context['page'] = 'index'
        context['cart'] = data.cart
        # context['cart'] = {'state': 'cart'}

        return context

class CheckoutView(BaseView):
    template_name = 'front/pages/Checkout/Checkout.jinja'

    def get_context_data(self, **kwargs):
        context = super(CheckoutView, self).get_context_data(**kwargs)

        context['OG'] = data.checkout['OG']
        context['data'] = data.checkout
        context['page'] = 'checkout'

        return context


class BlogView(BaseView):
    template_name = 'front/pages/Blog/Blog.jinja'

    def get_context_data(self, **kwargs):
        context = super(BlogView, self).get_context_data(**kwargs)

        context['data'] = data.blog
        context['news'] = data.news
        context['page'] = 'blog'

        return context


class BlogArticleView(BaseView):
    template_name = 'front/pages/BlogArticle/BlogArticle.jinja'

    def get_context_data(self, **kwargs):
        context = super(BlogArticleView, self).get_context_data(**kwargs)
        slug = kwargs.get('slug', None)

        context['article'] = data.articleContent[slug]
        context['data'] = data.blogArticle
        context['news'] = data.news
        context['page'] = 'blogArticle'

        return context


class Custom404View(BaseView):
    template_name = 'front/pages/NotFound/NotFound.jinja'

    def get(self, request, *args, **kwargs):
        response = super(Custom404View, self).get(request, *args, **kwargs)
        response.reason_phrase = 'NOT FOUND'
        response.status_code = 404

        return response

    def get_context_data(self, **kwargs):
        context = super(Custom404View, self).get_context_data(**kwargs)

        context['OG'] = data.notFound['OG']
        context['data'] = data.notFound
        context['page'] = '404'

        return context
