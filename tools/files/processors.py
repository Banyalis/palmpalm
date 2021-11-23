from io import BytesIO

from PIL import Image, ImageOps
from django.core.files.storage import default_storage
import mimetypes


class ProcessorNotRegistered(Exception):

    def __init__(self, processor):
        self.message = '"{}" processor is not registered.'.format(processor)

    def __str__(self):
        return self.message


class Registry(object):

    processors = {}

    def register(self, processor):
        if processor.ext not in self.processors:
            self.processors[processor.ext] = processor

    @staticmethod
    def extension(image=None, fmt=None, preset=None):

        if fmt:
            return mimetypes.guess_extension(Image.MIME[fmt])

        fmt = None

        if image:
            if not isinstance(image, Image.Image):
                image = Image.open(image)
            fmt = image.format

        if preset:
            if isinstance(preset, (tuple, list)):
                for proc in preset:
                    fmt = proc.get('format', None) or fmt
            else:
                fmt = preset.get('format', None) or fmt

        ext = mimetypes.guess_extension(Image.MIME[fmt]) if fmt else None

        return ext

    def _getproc(self, item):
        proc = self.processors.get(item)
        if not proc:
            raise ProcessorNotRegistered(item)
        return proc

    def __getattr__(self, item):
        return self._getproc(item)

    def __getitem__(self, item):
        return self._getproc(item)


class ImageProcessor(object):

    def __init__(self, image, storage=None):
        if not isinstance(image, Image.Image):
            self.image = Image.open(image)
        else:
            self.image = image
        self.storage = storage or default_storage

    def _save_kwargs(self, args):
        _args = {}

        if 'format' in args:
            _args['format'] = args['format']
        else:
            _args['format'] = self.image.format

        return _args

    def process_image(self, **kwargs):
        raise NotImplemented()

    @property
    def ext(self):
        raise NotImplemented()


class ThumbnailProcessor(ImageProcessor):

    ext = 'thumb'

    def process_image(self, width=None, height=None, **kwargs):

        if width and not height:
            height = width * self.image.size[1] / self.image.size[0]

        if height and not width:
            height = height * self.image.size[0] / self.image.size[1]

        self.image.thumbnail(
            (width, height),
            Image.ANTIALIAS
        )

        imagefile = BytesIO()

        save_kwargs = self._save_kwargs(kwargs)
        self.image.save(
            imagefile,
            **save_kwargs
        )

        return imagefile


class CropProcessor(ImageProcessor):

    ext = 'crop'

    def process_image(self, width, height, ppoi=(0.5, 0.5), **kwargs):

        ppoi_x_axis = int(self.image.size[0] * ppoi[0])
        ppoi_y_axis = int(self.image.size[1] * ppoi[1])
        center_pixel_coord = (ppoi_x_axis, ppoi_y_axis)

        orig_aspect_ratio = float(self.image.size[0]) / float(self.image.size[1])
        crop_aspect_ratio = float(width) / float(height)

        # Figure out if we're trimming from the left/right or top/bottom
        if orig_aspect_ratio >= crop_aspect_ratio:
            # `image` is wider than what's needed,
            # crop from left/right sides
            orig_crop_width = int(
                (crop_aspect_ratio * float(self.image.size[1])) + 0.5
            )
            orig_crop_height = self.image.size[1]
            crop_boundary_top = 0
            crop_boundary_bottom = orig_crop_height
            crop_boundary_left = center_pixel_coord[0] - (orig_crop_width // 2)
            crop_boundary_right = crop_boundary_left + orig_crop_width
            if crop_boundary_left < 0:
                crop_boundary_left = 0
                crop_boundary_right = crop_boundary_left + orig_crop_width
            elif crop_boundary_right > self.image.size[0]:
                crop_boundary_right = self.image.size[0]
                crop_boundary_left = self.image.size[0] - orig_crop_width

        else:
            # `image` is taller than what's needed,
            # crop from top/bottom sides
            orig_crop_width = self.image.size[0]
            orig_crop_height = int(
                (float(self.image.size[0]) / crop_aspect_ratio) + 0.5
            )
            crop_boundary_left = 0
            crop_boundary_right = orig_crop_width
            crop_boundary_top = center_pixel_coord[1] - (orig_crop_height // 2)
            crop_boundary_bottom = crop_boundary_top + orig_crop_height
            if crop_boundary_top < 0:
                crop_boundary_top = 0
                crop_boundary_bottom = crop_boundary_top + orig_crop_height
            elif crop_boundary_bottom > self.image.size[1]:
                crop_boundary_bottom = self.image.size[1]
                crop_boundary_top = self.image.size[1] - orig_crop_height

        # Cropping the image from the original image
        result = self.image.crop(
            (
                crop_boundary_left,
                crop_boundary_top,
                crop_boundary_right,
                crop_boundary_bottom
            )
        )

        result = result.resize(
            (width, height),
            Image.ANTIALIAS
        )

        imagefile = BytesIO()

        save_kwargs = self._save_kwargs(kwargs)
        result.save(
            imagefile,
            **save_kwargs
        )

        return imagefile


class ConvertProcessor(ImageProcessor):

    ext = 'convert'


class DefaultProcessor(ThumbnailProcessor):
    ext = None


registry = Registry()
registry.register(ThumbnailProcessor)
registry.register(ConvertProcessor)
registry.register(CropProcessor)
registry.register(DefaultProcessor)
