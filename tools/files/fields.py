# -*- coding: utf-8 -*-

import os
import shutil
import datetime
import re
from uuid import uuid1, uuid4

from django.db.models.fields.files import FieldFile
from django.db import models
from django.db.models import signals
from django.conf import settings
from django.template import Context, Template
from django.utils.deconstruct import deconstructible

import threading

from boto.s3.connection import ProtocolIndependentOrdinaryCallingFormat
import boto
from boto.s3.key import Key

from .utils import resize_bulk, remove_all_pictures, get_out_file, get_image_dimension


# Resolution arguments:
# 'w','h',
# 'crop'        : 'center'/None,
# 'corners'     : 0..max(w/2,h/2),
# 'qual'        : 1..100,
# 'out_format'  : 'png' and others
# 'add_param'   : convert additional parameters

# try:
#     from south.modelsinspector import add_introspection_rules
#
#     add_introspection_rules([], ["^.*\.CustomFileField"])
#     add_introspection_rules([], ["^.*\.CustomImgField"])
# except:
#     pass

IMAGES_DIRECTORY_ORIGINAL = 'original'


def get_path(path, instance):
    try:
        # TODO: think about it, test adaptive urls
        path.index('{{')
        t = Template(path)
        new_path = t.render(Context({"instance": instance}))
        return new_path
    except:
        return path

# The size of the column holding this file name is 100 chars
FILENAME_COLUMN_LENGTH = 100


def get_aspect(width, height):
    return float(width) / float(height) if width and height else -1


# replaced wrapper function for this:
# https://code.djangoproject.com/ticket/22999#no1
@deconstructible
class GenerateFilenameTo(object):
    def __init__(self, path):
        self.path = path

    def __call__(self, instance, old_filename):
        old_filename = os.path.basename(old_filename)
        base_name, file_ext = os.path.splitext(old_filename)
        base_name = re.sub(r"[^\w\s_-]", '', base_name)
        base_name = re.sub(r"\s+", '-', base_name)
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S__") + str(uuid4())[:8]

        filename_max_length = FILENAME_COLUMN_LENGTH - len(date + '_') - len(file_ext) - len(self.path + '/')
        new_filename = base_name[:filename_max_length] + '_' + date + file_ext
        return os.path.join(get_path(self.path, instance), new_filename)

# replaced wrapper function for this:
# https://code.djangoproject.com/ticket/22999#no1
@deconstructible
class GenerateDirnameTo(object):
    def __init__(self, path):
        self.path = path

    def __call__(self, instance, old_filename):
        date = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        new_filename = os.path.join(date, old_filename)
        return os.path.join(get_path(self.path, instance), new_filename)

class CustomFieldFile(FieldFile):
    def url(self):
        if not self.field.generate_dir:
            return os.path.join(self.field.MEDIA_URL, self.field.my_path, self.fname).replace('\\', '/') if self.fname else ''
        else:
            return os.path.join(self.field.MEDIA_URL, self.name).replace('\\', '/') if self.name else ''

    def __init__(self, instance, field, name):
        self.fname = os.path.basename(name) if name else None
        try:
            original_name, original_ext = os.path.splitext(self.fname)
            setattr(self, 'original_name', original_name[:-25] + original_ext)
        except:
            pass

        super(CustomFieldFile, self).__init__(instance, field, name)


class CustomFileField(models.FileField):
    my_path = ''
    attr_class = CustomFieldFile

    def __init__(self, file_path='fake', upload_to=None, generate_dir=False, MEDIA_URL=None, **kwargs):
        file_path = os.path.normpath(file_path)
        self.my_path = file_path
        self.generate_dir = generate_dir

        if not MEDIA_URL:
            MEDIA_URL = settings.MEDIA_URL

        self.MEDIA_URL = MEDIA_URL

        if not upload_to:
            if generate_dir:
                upload_to = GenerateDirnameTo(self.my_path)
            else:
                upload_to = GenerateFilenameTo(self.my_path)

        kwargs['max_length'] = kwargs.get('max_length', 255)

        super(CustomFileField, self).__init__(upload_to=upload_to, **kwargs)

    @classmethod
    def clear_files_on_delete(cls, instance, field_instance):
        inst_file = getattr(instance, field_instance.name, None)
        if inst_file:
            path = getattr(inst_file, 'path')
            if os.path.isfile(path):
                os.unlink(path)
                if field_instance.generate_dir:
                    os.rmdir(os.path.dirname(path))

    def contribute_to_class(self, cls, name):
        def clear_file(sender, instance, **kwargs):
            self.__class__.clear_files_on_delete(instance, self)

        super(CustomFileField, self).contribute_to_class(cls, name)
        signals.pre_delete.connect(clear_file, sender=cls)

    @classmethod
    def save(cls, instance, field_instance, save=True, add=False):
        try:
            cl = instance.__class__
            old_inst = cl.objects.get(id=instance.id) if not add and not instance._state.adding else None

            n = getattr(instance, field_instance.name, None)
            o = getattr(old_inst, field_instance.name, None) if old_inst else None
            if o and not n:
                cls.clear_files_on_delete(old_inst, field_instance)
            elif o and n:
                pn = getattr(n, 'path')
                po = getattr(o, 'path')
                if pn != po:
                    cls.clear_files_on_delete(old_inst, field_instance)
        except:
            pass

    def pre_save(self, model_instance, add, **kwargs):
        self.__class__.save(model_instance, self, True, add, **kwargs)
        return super(CustomFileField, self).pre_save(model_instance, add)


class CustomFieldImg(FieldFile):
    def __init__(self, instance, field, name):
        super(CustomFieldImg, self).__init__(instance, field, name)

        res = field.my_resolutions(instance) if hasattr(field.my_resolutions, '__call__') else field.my_resolutions

        w = getattr(instance, '%s_width' % (field.name,), None)
        h = getattr(instance, '%s_height' % (field.name,), None)

        if w and h:
            setattr(self, 'aspect', get_aspect(w, h))

        fname = os.path.basename(name) if name else None
        try:
            original_name, original_ext = os.path.splitext(fname)
            setattr(self, 'original_name', original_name[:-25]+original_ext)
        except:
            pass

        if not res:
            return

        for res_key, size in res.items():
            out_fname = get_out_file(fname, size)
            path = get_path(field.my_path, instance)
            setattr(self, res_key.replace('@','') + '_url',
                    os.path.join(settings.MEDIA_URL, path, res_key, out_fname).replace('\\', '/') if out_fname else '')
            setattr(self, res_key.replace('@','') + '_path',
                    os.path.join(settings.MEDIA_ROOT, path, res_key, out_fname) if out_fname else '')

    def take_file(self, path, original_name=False, custom_name='', save=True):
        if original_name:
            name = os.path.basename(path)
        elif custom_name:
            name = custom_name
            try:
                name.index('.')
            except ValueError:
                name += '.' + os.path.splitext(os.path.basename(path))[1]
        else:
            name = GenerateFilenameTo('')(self.instance, os.path.basename(path))
        new_my_path = get_path(self.field.my_path, self.instance)
        name = os.path.join(new_my_path, IMAGES_DIRECTORY_ORIGINAL, name)
        new_path = os.path.join(settings.MEDIA_ROOT, name)
        try:
            os.makedirs(os.path.dirname(new_path), 0o755)
        except:
            pass
        shutil.copyfile(path, new_path)
        setattr(self.instance, self.field.attname, name)

        if save:
            self.instance.save()

    def tn(self, tn_name=None):
        return getattr(self, tn_name + '_url', '')

    def tn_path(self, tn_name=None):
        return getattr(self, tn_name + '_path', '')

    def ratio(self):
        res = self.image_size()
        if not res: return None
        return res[0] * 1.0 / res[1]

    def image_size(self):
        return get_image_dimension(self.path)

    def regenerate_images(self, tn_name=None):
        CustomImgField.generate_images(self.instance, self.field, tn_name)
        pass

    def __getattribute__(self, item):
        if item.endswith('_url'):
            res = self.field.my_resolutions(self.instance) if hasattr(self.field.my_resolutions, '__call__') else self.field.my_resolutions
            fname = os.path.basename(self.name) if self.name else None
            res_key = item[:-4]
            out_fname = get_out_file(fname, res.get(res_key))
            path = get_path(self.field.my_path, self.instance)
            val = os.path.join(settings.MEDIA_URL, path, res_key, out_fname).replace('\\', '/') if out_fname else ''
            setattr(self, res_key.replace('@', '') + '_url', val)
            return val
        return super(CustomFieldImg, self).__getattribute__(item)


class CustomImgField(CustomFileField):
    attr_class = CustomFieldImg
    my_resolutions = {}

    def __init__(self, file_path='fake', upload_to=None, resolutions={}, **kwargs):
        file_path = os.path.normpath(file_path)
        self.my_resolutions = resolutions
        upload_to = GenerateFilenameTo(os.path.join(file_path, IMAGES_DIRECTORY_ORIGINAL))
        super(CustomImgField, self).__init__(file_path=file_path, upload_to=upload_to, **kwargs)

    @classmethod
    def generate_images(cls, instance, field_instance, tn_name=None):
        # print 'generating images'
        base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
        inst_file = getattr(instance, field_instance.name, None)

        res = field_instance.my_resolutions(instance) if hasattr(field_instance.my_resolutions, '__call__') else field_instance.my_resolutions

        #fields = instance.__class__._meta.get_fields()

        if inst_file and hasattr(instance, '%s_width' % (field_instance.name,)) and hasattr(instance, '%s_height' % (field_instance.name,)):
            path = os.path.join(os.path.join(settings.MEDIA_ROOT, inst_file.path))
            sz = get_image_dimension(path)

            if sz:
                setattr(instance, field_instance.name + '_width', sz[0])
                setattr(instance, field_instance.name + '_height', sz[1])

                super(instance.__class__, instance).save(update_fields=[field_instance.name + '_width', field_instance.name + '_height'])

        if inst_file:
            crop_data = None
            if hasattr(instance, field_instance.name+'_crop_data'):
                crop_data = getattr(instance, field_instance.name+'_crop_data')

            if res:
                resize_bulk(base_dir, os.path.basename(getattr(inst_file, 'path')), res, tn_name, crop_data=crop_data)

    @classmethod
    def clear_files_on_delete(cls, instance, field_instance):
        base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
        inst_file = getattr(instance, field_instance.name, None)

        res  = field_instance.my_resolutions(instance) if hasattr(field_instance.my_resolutions, '__call__') else field_instance.my_resolutions

        if inst_file:
            remove_all_pictures(base_dir, os.path.basename(getattr(inst_file, 'path')), res)

    @classmethod
    def save(cls, instance, field_instance, save=True, add=False):
        def gen():
            def save_images_once(sender, instance, **kwargs):
                signals.post_save.disconnect(save_images_once, sender=instance.__class__)
                cls.generate_images(instance, field_instance)

            signals.post_save.connect(save_images_once, sender=instance.__class__)

        try:
            cl = instance.__class__
            old_inst = cl.objects.get(id=instance.id) if not add and not instance._state.adding else None

            n = getattr(instance, field_instance.name, None)
            o = getattr(old_inst, field_instance.name, None) if old_inst else None
            if o and not n:
                cls.clear_files_on_delete(old_inst, field_instance)
            elif not o and n:
                gen()
            elif o and n:
                pn = getattr(n, 'path')
                po = getattr(o, 'path')
                if pn != po:
                    cls.clear_files_on_delete(old_inst, field_instance)
                    gen()
                else:
                    nc = getattr(instance, field_instance.name + '_crop_data', None)
                    oc = getattr(old_inst, field_instance.name + '_crop_data', None)
                    if nc != oc:
                        gen()
        except:
            gen()


class CustomFieldFileS3(CustomFieldFile):

    @FieldFile.file.getter
    def file(self):
        try:
            return super(CustomFieldFileS3, self)._get_file()
        except IOError:
            CustomFileFieldS3.download(self.instance, self.field)
            return super(CustomFieldFileS3, self)._get_file()


class CustomFileFieldS3(CustomFileField):
    attr_class = CustomFieldFileS3
    headers = None
    purge = None

    def __init__(self, file_path='fake', upload_to=None, headers=None, purge=True, local=False, **kwargs):
        self.headers = headers
        self.purge = purge
        self.local = local
        super(CustomFileFieldS3, self).__init__(file_path=file_path, upload_to=upload_to, **kwargs)

    @classmethod
    def clear_files_on_delete(cls, instance, field_instance):

        inst_file = getattr(instance, field_instance.name, None)

        if inst_file:
            if getattr(field_instance, 'generate_dir', False):
                base_dir = settings.MEDIA_ROOT
                base_name = getattr(inst_file, 'path')
            else:
                base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
                base_name = os.path.basename(getattr(inst_file, 'path'))

            fr = os.path.join(base_dir, base_name)
            t = os.path.join(settings.MEDIA_LOCATION, os.path.relpath(fr, settings.MEDIA_ROOT))

            if os.path.isfile(fr):
                os.unlink(fr)

            if getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None):
                cls.delete(t)


    @classmethod
    def upload(cls, fr, t, headers, purge):
        c = boto.s3.connect_to_region(settings.AWS_REGION,
                                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                      calling_format=ProtocolIndependentOrdinaryCallingFormat())
        b = c.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

        size = b.new_key(t).set_contents_from_filename(fr, headers)

        if size:
            if os.path.isfile(fr) and purge:
                os.unlink(fr)
                pass

        c.close()

    @classmethod
    def download(cls, instance, field_instance):

        inst_file = getattr(instance, field_instance.name, None)

        if not inst_file:
            return

        if getattr(field_instance, 'generate_dir', False):
            base_dir = settings.MEDIA_ROOT
            base_name = getattr(inst_file, 'path')
        else:
            base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
            base_name = os.path.basename(getattr(inst_file, 'path'))

        fr = os.path.join(base_dir, base_name)
        t = os.path.join(settings.MEDIA_LOCATION, os.path.relpath(fr, settings.MEDIA_ROOT))

        if not os.path.isfile(fr):
            c = boto.s3.connect_to_region(settings.AWS_REGION,
                                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                          calling_format=ProtocolIndependentOrdinaryCallingFormat())
            b = c.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

            k = Key(b)
            k.key = t
            k.get_contents_to_filename(fr)

            c.close()

    @classmethod
    def delete(cls, fn):

        c = boto.s3.connect_to_region(settings.AWS_REGION,
                                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                      calling_format=ProtocolIndependentOrdinaryCallingFormat())
        b = c.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

        b.delete_key(fn)
        c.close()

    @classmethod
    def storage(cls, instance, field_instance):
        # print 'generating images'

        inst_file = getattr(instance, field_instance.name, None)

        if getattr(field_instance, 'generate_dir', False):
            base_dir = settings.MEDIA_ROOT
            base_name = getattr(inst_file, 'path')
        else:
            base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
            base_name = os.path.basename(getattr(inst_file, 'path'))

        headers = field_instance.headers(instance, base_name) if hasattr(field_instance.headers, '__call__') else field_instance.headers

        fr = os.path.join(base_dir, base_name)
        t = os.path.join(settings.MEDIA_LOCATION, os.path.relpath(fr, settings.MEDIA_ROOT))

        thr = threading.Thread(target = cls.upload, args=(fr, t, headers, getattr(field_instance, 'purge', True))).start()

    @classmethod
    def save(cls, instance, field_instance, save=True, add=False):

        def gen():
            def save_images_once(sender, instance, **kwargs):
                if not getattr(field_instance, 'local', False):
                    cls.storage(instance, field_instance)

                signals.post_save.disconnect(save_images_once, sender=instance.__class__)

            signals.post_save.connect(save_images_once, sender=instance.__class__)

        try:
            cl = instance.__class__
            old_inst = cl.objects.get(id=instance.id) if not add and not instance._state.adding else None

            n = getattr(instance, field_instance.name, None)
            o = getattr(old_inst, field_instance.name, None) if old_inst else None

            if o and not n:
                cls.clear_files_on_delete(old_inst, field_instance)
            elif not o and n:
                gen()
            elif o and n:
                pn = getattr(n, 'path')
                po = getattr(o, 'path')
                if pn != po:
                    cls.clear_files_on_delete(old_inst, field_instance)
                    gen()
                else:
                    nc = getattr(instance, field_instance.name + '_crop_data', None)
                    oc = getattr(old_inst, field_instance.name + '_crop_data', None)
                    if nc != oc:
                        gen()
        except:
            pass


class CustomFieldImgS3(CustomFieldImg):

    @FieldFile.file.getter
    def file(self):
        try:
            return super(CustomFieldImgS3, self)._get_file()
        except IOError:
            CustomImgFieldS3.download(self.instance, self.field)
            return super(CustomFieldImgS3, self)._get_file()

    def regenerate_images(self, tn_name=None):
        CustomImgFieldS3.generate_images(self.instance, self.field, tn_name)
        pass


class CustomImgFieldS3(CustomImgField):

    attr_class = CustomFieldImgS3
    headers = None

    def __init__(self, file_path='fake', upload_to=None, resolutions={}, headers=None, **kwargs):
        self.headers = headers
        super(CustomImgFieldS3, self).__init__(file_path=file_path, resolutions=resolutions, upload_to=upload_to, **kwargs)

    @classmethod
    def upload(cls, fr, t, headers):
        c = boto.s3.connect_to_region(settings.AWS_REGION,
                                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                      calling_format=ProtocolIndependentOrdinaryCallingFormat())
        b = c.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

        size = b.new_key(t).set_contents_from_filename(fr, headers)

        if size:
            if os.path.isfile(fr):
                os.unlink(fr)

        c.close()

    @classmethod
    def download(cls, instance, field_instance):

        base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
        inst_file = getattr(instance, field_instance.name, None)

        if not inst_file:
            return

        base_name = os.path.basename(getattr(inst_file, 'path'))

        fr = os.path.join(base_dir, IMAGES_DIRECTORY_ORIGINAL, base_name)
        t = os.path.join(settings.MEDIA_LOCATION, os.path.relpath(fr, settings.MEDIA_ROOT))

        if not os.path.isfile(fr):
            print('fetching from s3...')

            c = boto.s3.connect_to_region(settings.AWS_REGION,
                                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                          calling_format=ProtocolIndependentOrdinaryCallingFormat())
            b = c.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

            k = Key(b)
            k.key = t
            k.get_contents_to_filename(fr)

            c.close()

    @classmethod
    def generate_images(cls, instance, field_instance, tn_name=None):

        if not getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None):

            super(CustomImgFieldS3, cls).generate_images(instance, field_instance, tn_name)

        else:

            base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
            inst_file = getattr(instance, field_instance.name, None)

            if not inst_file:
                return

            base_name = os.path.basename(getattr(inst_file, 'path'))

            fr = os.path.join(base_dir, IMAGES_DIRECTORY_ORIGINAL, base_name)
            t = os.path.join(settings.MEDIA_LOCATION, os.path.relpath(fr, settings.MEDIA_ROOT))

            if not os.path.isfile(fr):
                print('fetching from s3...')

                c = boto.s3.connect_to_region(settings.AWS_REGION,
                                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                              calling_format=ProtocolIndependentOrdinaryCallingFormat())
                b = c.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

                k = Key(b)
                k.key = t
                k.get_contents_to_filename(fr)

                c.close()

            super(CustomImgFieldS3, cls).generate_images(instance, field_instance, tn_name)

            folders = dict(((IMAGES_DIRECTORY_ORIGINAL, None),))
            res = field_instance.my_resolutions(instance) if hasattr(field_instance.my_resolutions, '__call__') else field_instance.my_resolutions
            if tn_name:
                res = {
                    tn_name: res[tn_name]
                }
            folders.update(res)

            wait_threads = []

            for folder, size in folders.items():
                fr = os.path.join(base_dir, folder, get_out_file(base_name, size) if size else base_name)
                t = os.path.join(settings.MEDIA_LOCATION, os.path.relpath(fr, settings.MEDIA_ROOT))

                headers  = field_instance.headers(instance, folder) if hasattr(field_instance.headers, '__call__') else field_instance.headers

                t = threading.Thread(target = cls.upload, args=(fr, t, headers,))

                if not size or size.get('sync', False):
                    wait_threads.append(t)

                t.start()

            for t in wait_threads:
                t.join()
