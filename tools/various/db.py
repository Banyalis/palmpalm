# -*- coding: utf-8 -*-
import re
from datetime import datetime
from collections import OrderedDict
from django.core.exceptions import FieldDoesNotExist
from django.db import models
from tools.files.fields import CustomImgFieldS3
from djangorestframework_camel_case.render import CamelCaseJSONRenderer
from cached_property import cached_property
import json

from caching.base import CachingManager as CMCachingManager, CachingQuerySet as CMCachingQuerySet
from django.core.cache.backends.base import DEFAULT_TIMEOUT

from .fields import CustomListField


class Base(models.Model):
    """
    Abstract model with frequently used methods
    """
    order = models.IntegerField(blank=True, default=0, db_index=True)
    pub_date = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ('order', 'id',)
        abstract = True


class CachingManager(CMCachingManager):

    def get_queryset(self):
        return CachingQuerySet(self.model, using=self._db)


class CachingQuerySet(CMCachingQuerySet):
    """
    Restore right DEFAULT_TIMEOUT after this:
    > self.filters = copy.deepcopy(self.base_filters)
    in django-filters(django_filters/filterset.py) BaseFilterSet constructor.

    Possible solution is replace deepcopy to:
            for k, v in self.base_filters.items():
            t = copy.deepcopy(v)
            if 'queryset' in v.__dict__:
                t.queryset.timeout = v.queryset.timeout
            self.filters[k] = t
    """

    def _clone(self, *args, **kw):
        qs = super(CachingQuerySet, self)._clone(*args, **kw)
        try:
            if self.timeout != DEFAULT_TIMEOUT:
                int(self.timeout)
            qs.timeout = self.timeout
        except TypeError:
            qs.timeout = DEFAULT_TIMEOUT
        return qs


class SerializerQuerySet(CachingQuerySet):

    def serialized(self):
        return json.loads(CamelCaseJSONRenderer().render(
            self.model.get_serializer()(self, many=True).data
        ))


class SerializeMixin(object):

    @classmethod
    def get_serializer(cls):
        raise NotImplemented("You must implement get_serializer method")

    @property
    def serializer(self):
        return self.__class__.get_serializer(self.page_type)

    @property
    def serialized(self):
        # try:
        return json.loads(CamelCaseJSONRenderer().render(
            self.get_serializer(self.page_type)(self).data
        ))
        # except TypeError:
        #     return None


class CastMixin(object):

    @cached_property
    def casted(self):
        for cls in self.__class__.__subclasses__():
            instance = getattr(self, cls._meta.model_name, None)
            if instance:
                return instance

        return self.create_cast() or self

    def create_cast(self):
        return None


class CastManager(models.Manager):

    def get_queryset(self):
        return super(CastManager, self).get_queryset().select_related(
            *[cls._meta.model_name for cls in self.model.__subclasses__() if not cls._meta.proxy]
        )


class MetadataMixin(models.Model):

    meta_og_img_resolutions = {
        'cms': {'w': 450, 'h': 280, 'crop': 'center'},
        'og': {'w': 1200, 'h': 630, 'crop': 'center'},
    }

    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)
    meta_og_title = models.CharField(max_length=255, blank=True, null=True)
    meta_og_description = models.TextField(blank=True, null=True)

    meta_og_img = CustomImgFieldS3(file_path='og', resolutions=meta_og_img_resolutions, blank=True, null=True, default='')
    meta_og_img_width = models.IntegerField(blank=True, default=0)
    meta_og_img_height = models.IntegerField(blank=True, default=0)

    class Meta:
        abstract = True
