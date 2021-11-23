# -*- coding: utf-8 -*-


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import json
import environ

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = environ.Env()
if os.path.isfile(os.path.join(BASE_DIR, '.env')):
    env.read_env(os.path.join(BASE_DIR, '.env'))  # reading .env file
else:
    env.read_env(os.path.join(BASE_DIR, '.env.example'))  # reading .env.example file


SECRET_KEY = '8dk9)hil3*c2)%h$&v*krz!r8i6v!s&7$v3-@c$fxb6-zhxr_z'

DEBUG = env.bool('DEBUG', default=False)

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'cms',
    'palmpalm',
    'django_js_reverse',
    'tools.files',

    'rest_framework',
    'django_filters',
    'webpack_loader'
)

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Middleware for custom language routing
    # 'tools.various.middleware.LanguageMiddleware',
    # Middleware for common language routing
    # 'django.middleware.locale.LocaleMiddleware'
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [os.path.join(os.path.abspath(BASE_DIR), 'templates'),
                 os.path.join(os.path.abspath(BASE_DIR), 'assets', 'app'),
                 os.path.join(os.path.abspath(BASE_DIR), 'assets', 'custom_libs'),
                 os.path.join(os.path.abspath(BASE_DIR), 'static')],
        'APP_DIRS': True,
        'OPTIONS': {
            'auto_reload': True,
            'trim_blocks': True,
            'lstrip_blocks': True,
            'environment': 'config.jinja.environment',
            'extensions': ['jinja2.ext.do', 'jinja2.ext.loopcontrols', 'jinja2.ext.i18n', 'jinja2.ext.with_', ],
        },
    },
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DB_CONFIG = env.db('DATABASE_URL')

DB_CONFIG.update({
    'OPTIONS': {
        'init_command': 'SET group_concat_max_len = 16384',
        'charset': 'utf8mb4'
    }
})

DATABASES = {
    'default': DB_CONFIG,
}

CACHES = {
    'default': env.cache_url('CACHE_URL'),
    'cache_machine': env.cache_url('CACHEMACHINE_URL', env.cache_url('CACHE_URL')),
}

CACHE_INVALIDATE_ON_CREATE = 'whole-model'
CACHE_COUNT_TIMEOUT = 60
CACHE_EMPTY_QUERYSETS = True

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

MEDIA_LOCATION = 'media'
MEDIA_TEMP_URL = "/%s/" % (MEDIA_LOCATION,)

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = env.str('STATIC_URL', '/static/')
MEDIA_URL = env.str('MEDIA_URL', '/%s/' % (MEDIA_LOCATION,))

FRONT_STATS = None
CONTROL_STATS = None

try:
    with open(os.path.join(BASE_DIR, 'webpack.front.stats.json')) as front_stats:
        FRONT_STATS = json.load(front_stats)
except IOError:
    print('No webpack.front.stats.json file')

try:
    with open(os.path.join(BASE_DIR, 'webpack.control.stats.json')) as control_stats:
        CONTROL_STATS = json.load(control_stats)
except IOError:
    print('No webpack.control.stats.json file')

# Information to link builded static files with Django.
# For Django to know by what name to reference
WEBPACK_BUNDLES = {
    'front': FRONT_STATS,
    'control': CONTROL_STATS,
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.BrowsableAPIRenderer',
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'JSON_UNDERSCOREIZE': {
        'no_underscore_before_number': True,
    },
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': False,
        'BUNDLE_DIR_NAME': '',
        'LOADER_CLASS': 'app.module.ExternalWebpackLoader',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack.front.stats.json'),
    },
    'CONTROL': {
        'CACHE': False,
        'BUNDLE_DIR_NAME': '',
        'LOADER_CLASS': 'app.module.ExternalWebpackLoader',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack.control.stats.json'),
    }
}

SILENCED_SYSTEM_CHECKS = ["auth.W004"]

SESSION_COOKIE_AGE = 3 * 60 * 60  # 3 hours
