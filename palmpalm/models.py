# -*- coding: utf-8 -*-

from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.files.base import ContentFile, File
from caching.base import CachingMixin
from django.utils import timezone
from django.template.loader import get_template

from mimetypes import guess_extension
from urllib.request import urlretrieve
from lxml.html import fragment_fromstring
from lxml import etree

from tools.various.db import CachingManager, Base
from tools.files.models import TempFile
from tools.files.fields import CustomImgFieldS3, CustomFileFieldS3
from tools.files.fields_v2 import CustomImageField
