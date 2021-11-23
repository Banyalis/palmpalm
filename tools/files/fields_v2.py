# -*- coding: utf-8 -*-

import os
import shutil
import datetime
import re
from uuid import uuid1, uuid4

from django.db.models.fields.files import FieldFile, ImageField, FileField, ImageFieldFile
from django.db import models
from django.db.models import signals
from django.conf import settings
from django.template import Context, Template
from django.utils.deconstruct import deconstructible

import threading

from .utils import resize_bulk, remove_all_pictures, get_out_file, get_image_dimension

from .processors import registry, ProcessorNotRegistered


class CustomFieldFile(FieldFile):

    def save(self, name, content, save=True):
        return super().save(name, content, save)


class CustomFileField(FileField):
    attr_class = CustomFieldFile

    def generate_filename(self, instance, filename):
        return super().generate_filename(instance, filename)

    def pre_save(self, model_instance, add):
        old = getattr(type(model_instance).objects.get(pk=model_instance.pk), self.attname)
        new = getattr(model_instance, self.attname)
        if old and old != new:
            old.delete(save=False)
        return super().pre_save(model_instance, add)


class CustomFieldImage(CustomFieldFile):

    @staticmethod
    def _process(processor, content):
        proc = registry[processor.get('processor', None)](content)
        return proc.process_image(**processor)

    def _filename(self, content=None, filename=None, preset=None):
        base_name, file_ext = os.path.splitext(filename or self.name)
        return '{}{}'.format(base_name, registry.extension(content, preset=preset) or file_ext)

    def delete(self, save=True):
        # Clear the image dimensions cache
        if hasattr(self, '_dimensions_cache'):
            del self._dimensions_cache

        _filename = self.name

        super().delete(save)

        presets = self.field.presets(self.instance) if callable(self.field.presets) else self.field.presets

        for key, preset in presets.items():
            dirname, filename = os.path.split(self._filename(filename=_filename, preset=preset))
            self.storage.delete(os.path.join(dirname, key, filename))

    def save(self, name, content, save=True):
        super().save(name, content, save)
        presets = self.field.presets(self.instance) if callable(self.field.presets) else self.field.presets

        for key, preset in presets.items():
            _content = content
            if isinstance(preset, (tuple, list)):
                for processor in preset:
                    _content = self._process(processor, _content)
            else:
                _content = self._process(preset, _content)

            dirname, filename = os.path.split(self._filename(content, preset=preset))

            self.storage.save(os.path.join(dirname, key, filename), _content, max_length=self.field.max_length)


class CustomImageField(ImageField, CustomFileField):
    attr_class = CustomFieldImage
    # descriptor_class = ImageFileDescriptor

    def __init__(self, verbose_name=None, name=None, width_field=None, height_field=None, presets=None, **kwargs):
        self.presets = presets
        super().__init__(verbose_name, name, width_field, height_field, **kwargs)

    def generate_filename(self, instance, filename):
        return super().generate_filename(instance, filename)
