# -*- coding: utf-8 -*-

import inspect
from rest_framework import serializers
from rest_framework.fields import SkipField
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ListSerializer
from django.core.files import File
from django.core.files.base import ContentFile
import json
import copy
import requests
import os
import re
from django.db.models import Model

from django.conf import settings

from tools.various.fields import CustomListField
from tools.files.fields import CustomImgField, CustomFileField, CustomImgFieldS3, CustomFileFieldS3, get_aspect
from tools.files.models import TempFile
from tools.files.utils import get_image_dimension


phone_re = re.compile(r'^\+7(\w+)')


class CustomJSONField(serializers.JSONField):

    def to_representation(self, obj):
        if isinstance(obj, str):
            return json.loads(obj)
        return obj

    def to_internal_value(self, data):
        if isinstance(data, str):
            return json.loads(data)
        return data


class CustomImageField(CustomJSONField):

    def __init__(self, **kwargs):
        self.resolutions = kwargs.pop('resolutions', None)
        self.duplicate_instance = kwargs.pop('duplicate_instance', None)
        kwargs.pop('max_length', None)
        super(CustomImageField, self).__init__(**kwargs)

    def to_representation(self, obj):

        resolutions = obj.field.my_resolutions(obj.instance)\
            if hasattr(obj.field.my_resolutions, '__call__')\
            else obj.field.my_resolutions

        res = {
            '%s_url' % (key,): getattr(obj, '%s_url' % (key,), None)
            for key in (self.resolutions or resolutions.keys())
        } if obj else None

        if res:

            w = getattr(obj.instance, '%s_width' % (self.field_name,), None)
            h = getattr(obj.instance, '%s_height' % (self.field_name,), None)

            alt = getattr(obj.instance, '%s_alt' % (self.field_name,), None)

            if alt is not None:
                res.update({
                    'alt': alt
                })

            if w and h:
                res.update({
                    'aspect': round(get_aspect(w, h), 4)
                })

        return res

    def to_internal_value(self, data):

        try:
            # if isinstance(data, basestring) and os.path.isfile(data):
            #     return super(CustomImageField, self).to_internal_value(
            #         ContentFile(open(data), name=os.path.basename(data)))

            if isinstance(data, File):
                return super(CustomImageField, self).to_internal_value(data)

            temp_file_id = None
            url = None

            if isinstance(data, dict):
                temp_file_id = data.get('temp_file_id', None)
                url = data.get('url', None)

                alt = data.get('alt', None)

                if alt is not None and self.parent.instance:
                    setattr(self.parent.instance, '%s_alt' % (self.field_name,), alt)

            instance = self.parent.instance
            # if not isinstance(instance, Model):
            #     print self.context

            field = getattr(instance, self.field_name, None)

            if self.duplicate_instance:
                field = getattr(self.duplicate_instance, self.field_name, None)
                return super(CustomImageField, self).to_internal_value(File(open(field.file.name, 'rb'), name=field.original_name))

            if temp_file_id:
                temp_image = TempFile.objects.get(id=temp_file_id)
                return super(CustomImageField, self).to_internal_value(File(open(temp_image.file.path, 'rb'), name=temp_image.originalName))

            if url:
                request = requests.get(url, verify=False, stream=True)
                request.raise_for_status()
                return super(CustomImageField, self).to_internal_value(ContentFile(request.content, name=url))

            if field:
                return field

            else:
                raise SkipField
                #res = super(CustomImageField, self).to_internal_value(data)
                #return res

        except AttributeError:
            raise SkipField
            #return super(CustomImageField, self).to_internal_value(data)


class CustomFileFieldSerializer(serializers.FileField):

    def __init__(self, **kwargs):
        self.duplicate_instance = kwargs.pop('duplicate_instance', None)
        kwargs.pop('max_length')
        super(CustomFileFieldSerializer, self).__init__(**kwargs)

    def to_representation(self, obj):
        return obj.url() or None

    def to_internal_value(self, data):

        try:
            temp_file_id = None
            url = None

            if isinstance(data, File):
                return super(CustomFileFieldSerializer, self).to_internal_value(data)

            if isinstance(data, dict):
                temp_file_id = data.get('temp_file_id', None) if isinstance(data, dict) else None
                url = data.get('url', None) if isinstance(data, dict) else None
            field = getattr(self.parent.instance, self.field_name, None)

            if self.duplicate_instance:
                field = getattr(self.duplicate_instance, self.field_name, None)
                return super(CustomFileFieldSerializer, self).to_internal_value(File(open(field.file.name, 'rb'), name=field.original_name))

            if temp_file_id:
                temp_image = TempFile.objects.get(id=temp_file_id)
                return super(CustomFileFieldSerializer, self).to_internal_value(File(open(temp_image.file.path, 'rb'), name=temp_image.originalName))

            if url:
                request = requests.get(url, verify=False, stream=True)
                request.raise_for_status()
                return super(CustomFileFieldSerializer, self).to_internal_value(ContentFile(request.content, name=os.path.basename(url)))

            if field:
                return field

            else:
                return File(os.path.join(settings.MEDIA_ROOT, os.path.relpath(data, settings.MEDIA_URL) if data.startswith('http') else data )) if data else None

        except AttributeError:
            return super(CustomFileFieldSerializer, self).to_internal_value(data)


class CustomDurationField(serializers.DurationField):

    def to_representation(self, obj):
        res = super(CustomDurationField, self).to_representation(obj)
        res = u':'.join([part for i, part in enumerate(res.split(u':')) if int(part) or i])
        return res


class CustomListSerializer(ListSerializer):
    update_lookup_field = 'id'

    def update(self, queryset, all_validated_data):
        id_attr = getattr(self.child.Meta, 'update_lookup_field', 'id')

        all_validated_data_by_id = {
            i.pop(id_attr): i
            for i in all_validated_data
        }

        if not all((bool(i) and not inspect.isclass(i)
                    for i in all_validated_data_by_id.keys())):
            raise ValidationError('')

        # since this method is given a queryset which can have many
        # model instances, first find all objects to update
        # and only then update the models
        objects_to_update = queryset.filter(**{
            '{}__in'.format(id_attr): all_validated_data_by_id.keys(),
        })

        if len(all_validated_data_by_id) != objects_to_update.count():
            raise ValidationError('Could not find all objects to update.')

        updated_objects = []

        for obj in objects_to_update:
            obj_id = getattr(obj, id_attr)
            obj_validated_data = all_validated_data_by_id.get(obj_id)

            # use model serializer to actually update the model
            # in case that method is overwritten
            updated_objects.append(self.child.update(obj, obj_validated_data))

        return updated_objects


class CustomPhoneField(serializers.CharField):

    def to_representation(self, obj):
        if not isinstance(obj, str):
            s = str(obj)
            res = phone_re.match(s)
            if res:
                return res.group(1)
            return s
        return obj


class CustomModelSerializer(serializers.ModelSerializer):

    serializer_field_mapping = copy.deepcopy(serializers.ModelSerializer.serializer_field_mapping)
    serializer_field_mapping[CustomListField] = CustomJSONField
    serializer_field_mapping[CustomImgField] = CustomImageField
    serializer_field_mapping[CustomFileField] = CustomFileFieldSerializer
    serializer_field_mapping[CustomImgFieldS3] = CustomImageField
    serializer_field_mapping[CustomFileFieldS3] = CustomFileFieldSerializer
    serializer_field_mapping[PhoneNumberField] = CustomPhoneField

    def __init__(self, *args, **kwargs):
        self.duplicate_instance = kwargs.pop('duplicate_instance', None)
        super(CustomModelSerializer, self).__init__(*args, **kwargs)

    def build_field(self, field_name, info, model_class, nested_depth):
        field_class, field_kwargs = super(CustomModelSerializer, self).build_field(field_name, info, model_class, nested_depth)

        if field_class is CustomImageField or \
            field_class is CustomFileFieldSerializer or \
            field_class is CustomModelSerializer:

            field_kwargs.update({
                'duplicate_instance': self.duplicate_instance
            })

        return field_class, field_kwargs

    def save(self, **kwargs):
        try:
            return super(CustomModelSerializer, self).save(**kwargs)
        except DjangoValidationError as e:
            if hasattr(e, 'error_dict'):
                raise ValidationError({
                    k: ', '.join([_e.message for _e in v])
                    for (k, v) in e.error_dict.items()
                })

            if hasattr(e, 'error_list'):
                raise ValidationError(', '.join([v.message for v in e.error_list]))

            raise ValidationError(e)


class BulkListSerializer(ListSerializer):
    update_lookup_field = 'id'

    def update(self, queryset, all_validated_data):
        id_attr = getattr(self.child.Meta, 'update_lookup_field', 'id')

        all_validated_data_by_id = {
            i.pop(id_attr): i
            for i in all_validated_data
        }

        if not all((bool(i) and not inspect.isclass(i)
                    for i in all_validated_data_by_id.keys())):
            raise ValidationError('')

        # since this method is given a queryset which can have many
        # model instances, first find all objects to update
        # and only then update the models
        objects_to_update = queryset.filter(**{
            '{}__in'.format(id_attr): all_validated_data_by_id.keys(),
        })

        if len(all_validated_data_by_id) != objects_to_update.count():
            raise ValidationError('Could not find all objects to update.')

        updated_objects = []

        for obj in objects_to_update:
            obj_id = getattr(obj, id_attr)
            obj_validated_data = all_validated_data_by_id.get(obj_id)

            # use model serializer to actually update the model
            # in case that method is overwritten
            updated_objects.append(self.child.update(obj, obj_validated_data))

        return updated_objects
