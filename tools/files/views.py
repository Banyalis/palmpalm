from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from tools.files import models
import json
from . import utils


@csrf_exempt
def upload_temp_file(request, param="", format=None):
    try:
        fFile = request.FILES[list(request.FILES.keys())[0]]
    except IndexError:
        return HttpResponseBadRequest()
    tf = models.TempFile.create_from_form_file(request, fFile, param)
    return HttpResponse(json.dumps(tf.description()))


@csrf_exempt
def upload_temp_file_image(request, param="", format=None):
    try:
        fFile = request.FILES[list(request.FILES.keys())[0]]
    except IndexError:
        return HttpResponseBadRequest()
    tf = models.TempFile.create_from_form_file(request, fFile, param)
    description = tf.description()
    try:
        width, height = utils.get_image_dimension(tf.file.path)
        description['width'] = width
        description['height'] = height
        description['ratio'] = float(width)/height
    except: pass
    return HttpResponse(json.dumps(description))


@csrf_exempt
def upload_temp_files(request, param="", format=None):
    res = []
    try:
        fileName = list(request.FILES.keys())[0]
    except IndexError:
        return HttpResponseBadRequest()
    for file in request.FILES.getlist(fileName):
        tf = models.TempFile.create_from_form_file(request, file, param)
        res.append(tf.description())
    return HttpResponse(json.dumps(res))


@csrf_exempt
def upload_temp_files_image(request, param="", format=None):
    res = []
    try:
        fileName = list(request.FILES.keys())[0]
    except IndexError:
        return HttpResponseBadRequest()
    for file in request.FILES.getlist(fileName):
        tf = models.TempFile.create_from_form_file(request, file, param)
        description = tf.description()
        try:
            width, height = utils.get_image_dimension(tf.file.path)
            description['width'] = width
            description['height'] = height
            description['ratio'] = float(width)/height
        except: pass
        res.append(description)
    return HttpResponse(json.dumps(res))


@csrf_exempt
def detect_color_type(request, format=None):
    tf = models.TempFile.get_tp_from_url(request.GET['url'])
    return HttpResponse(utils.get_color_type(tf.file.path))
