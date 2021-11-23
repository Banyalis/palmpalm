# -*- coding: utf-8 -*-
import json
import os
import re

from django.contrib.staticfiles.storage import staticfiles_storage
from django.utils.html import linebreaks, escape
from django.utils.translation import ugettext
from django.urls import reverse
from django.template.loader import engines
from django.conf import settings

from jinja2 import Environment, Markup

from config.settings import BASE_DIR, STATIC_ROOT


def includeraw(template):
    env = engines['jinja2'].env
    source, fn, _ = env.loader.get_source(env, template)

    return source


def active(request, pattern):
    """
    Template tag to highlight selected page in the menu
    """
    if re.search(pattern, request.path):
        return 'isActive'
    return ''


def nl2br(input):
    return linebreaks(escape(input))


def jsonify(value):
    return json.dumps(value)


def require(template):
    return includeraw(template)


def bundle(bundle_name, chunk_name, file):
    if settings.DEBUG:
        with open(os.path.join(settings.BASE_DIR, 'webpack.{}.stats.json'.format(bundle_name))) as stats:
            bundle_data = json.load(stats)
    else:
        bundle_data = settings.WEBPACK_BUNDLES.get(bundle_name, None)

    file_data = file.split('.')
    file_name = file_data[0]
    file_ext = file_data[1]

    chunk = bundle_data['chunks'].get(chunk_name, [])

    try:
        bundle_file_name = [str(f) for f in chunk if os.path.basename(str(f)).startswith(file_name) and os.path.basename(str(f)).endswith(file_ext)][0]
    except IndexError:
        bundle_file_name = ''

    return bundle_file_name


def is_mobile(request):
    return request.is_mobile


def svg_content(name):
    try:
        return Markup(open(os.path.join(STATIC_ROOT, 'svg', name)).read().replace('\n', ''))
    except FileNotFoundError:
        return ''


def environment(**options):
    env = Environment(**options)

    if os.path.isfile(os.path.join(BASE_DIR, 'config.json')):
        with open(os.path.join(BASE_DIR, 'config.json')) as f:
            config = json.loads(f.read())
    else:
        with open(os.path.join(BASE_DIR, 'config.test.json')) as f:
            config = json.loads(f.read())

    env.filters['jsonify'] = jsonify
    env.filters['require'] = require
    env.filters['nl2br'] = nl2br

    env.globals.update({
        'bundle': bundle,
        'static': staticfiles_storage.url,
        'active': active,
        'url': reverse,
        '_': ugettext,
        'config': config,
        'settings': settings,
        'DEBUG': settings.DEBUG,
        'STATIC_URL': settings.STATIC_URL,
        'MEDIA_URL': settings.MEDIA_URL,
        'includeraw': includeraw,
        'isMobile': is_mobile,
        'svg_content': svg_content,
    })
    return env
