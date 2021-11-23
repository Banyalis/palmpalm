import os
import re
import shutil
from . import fields
import glob
import json

import io


def get_command_output(cmd):
    p = os.popen(cmd)
    s = p.readline()
    p.close()
    return s


def get_command_output_full(cmd):
    p = os.popen(cmd)
    s = "\n".join(p.readlines())
    p.close()
    return s


def get_image_dimension(srcPath):
    param = "identify \"%s\"" % (srcPath,)
    # fullPathParam = "/usr/local/bin/"+param
    res = get_command_output(param) or get_command_output("/usr/local/bin/" + param) or get_command_output(
        "/opt/local/bin/" + param)
    m = re.search('\s(\d+)x(\d+)\s', res)

    if not m:
        return None

    return [int(m.groups(0)[0]),
            int(m.groups(0)[1])]



def get_out_file(filename, size):
    out_format = size.get('out_format') if size else None
    return (filename.rsplit(".", 1)[0] + '.' + out_format) if out_format and filename else filename


def run_command_full(param):
    print("run_command_full: ", param)
    res = os.system(param)
    if res: res = os.system("/usr/local/bin/" + param)
    if res: res = os.system("/opt/local/bin/" + param)
    return res

def resize(path, size, new_path=None, crop_data=None):
    if isinstance(crop_data, str):
        crop_data = json.loads(crop_data)
    #print 'crop_data: ', crop_data

    # crop - None,center
    profile_path = os.path.join(os.path.dirname(__file__), 'sRGB.icm')
    if not new_path:
        new_path = get_out_file(path, size)
    corners = size.get('corners')
    options = size.get('options', [])

    if size.get('custom_cmd'):
        param = "convert \"%s\" %s -profile \"%s\" \"%s\"" % (path, size.get('custom_cmd'), profile_path, new_path)
        add_param = ''
    else:
        width = size.get('w')
        height = size.get('h')
        qual = size.get('qual') or (90 if (width or 0) * (height or 0) > 200000 else 98)
        crop = size.get('crop')
        add_param = size.get('add_param') or ''

        try:
            print('resize:' + str(path))
            sz = get_image_dimension(path)
            print('   size:', sz, '\n   need:', size)

            if (not corners) and (sz[0] == width) and (sz[1] == height):
                return

            if 'crop_only_horizontal' in options and sz[0] < sz[1]:
                crop = None
                height = None

        except Exception as e:
            print('Error: ', str(e))
            return

        try:
            if crop:
                print('crr', get_image_dimension(path)[0])
                if get_image_dimension(path)[0] < width:
                    k = get_image_dimension(path)[0] * 1.0 / width
                    print('crop', k)
                    width = int(k * width)
                    height = int(k * height)
        except:
            pass

        extent = "{width}x{height}".format(width=min(width or sz[0], sz[0]), height=min(height or sz[1], sz[1]))
        sz = "{width}x{height}".format(width=width or "", height=height or "")

        crc = ''

        if crop_data and size.get('name') and crop_data.get(size.get('name')):
            crd = crop_data[size.get('name')]
            crc = 'convert "{p}" -crop "{w}x{h}+{l}+{t}" "{p}"'.format(p=path, w=crd['width'], h=crd['height'], l=crd['left'], t=crd['top'])
            run_command_full(crc)

        if crop == 'center':
            param = "convert -background none \"%s\" -resize \"%s^\" -gravity center -extent \"%s\" -layers OptimizeTransparency -auto-orient -strip -interlace Plane -quality %d -profile \"%s\" %s\"%s\"" % (
                path, extent, extent, qual, profile_path, add_param, new_path)
        elif crop == 'top':
            param = "convert -background none \"%s\" -resize \"%s^\" -gravity north -extent \"%s\" -layers OptimizeTransparency -auto-orient -strip -interlace Plane -quality %d -profile \"%s\" %s\"%s\"" % (
                path, sz, sz, qual, profile_path, add_param, new_path)
        # elif crop=='top':
        # param = "convert \"%s\" -resize \"%d>x\" -crop \"%dx%d+0+0\" -layers OptimizeTransparency -quality %d %s\"%s\"" % (path, width, width, height, qual, add_param, new_path)
        else:
            param = "convert -background none \"%s\" -resize \"%s>\" -sampling-factor 4:2:0 -layers OptimizeTransparency -auto-orient -strip -interlace Plane -quality %d -profile \"%s\" %s\"%s\"" % (
                path, sz, qual, profile_path, add_param, new_path)

    # print 'param guard'
    print(param)

    res = os.system(param)
    if res: res = os.system("/usr/local/bin/" + param)
    if res: res = os.system("/opt/local/bin/" + param)

    if corners:
        make_corners(new_path, size)


def make_corners(path, size):
    sz = get_image_dimension(path)
    corners = size.get('corners')
    param = 'convert -size %dx%d xc:none -draw "roundrectangle 0,0,%d,%d,%d,%d" png:- | convert "%s" -matte - -compose DstIn -composite "%s"' % (
        sz[0], sz[1], sz[0] - 1, sz[1] - 1, corners, corners, path, path)
    res = os.system(param)
    if res: res = os.system("/usr/local/bin/" + param)


def resize_bulk(directory, filename, sizes, tn_name=None, crop_data=None):
    path = os.path.join(directory, fields.IMAGES_DIRECTORY_ORIGINAL, filename)

    for label, size in sizes.items():
        if tn_name and label != tn_name: continue
        fname2 = get_out_file(filename, size)
        resized_path = os.path.join(directory, label, fname2)

        try:
            os.makedirs(os.path.join(directory, label), 0o775)
        except os.error:
            pass

        shutil.copyfile(path, resized_path)
        size['name'] = label
        resize(resized_path, size, crop_data=crop_data)


def remove_all_pictures(directory, filename, sizes):
    fname2 = (filename.rsplit(".", 1)[0] + '.*')

    try:
        os.unlink(os.path.join(directory, fields.IMAGES_DIRECTORY_ORIGINAL, filename))
    except:
        pass

    for label, size in sizes.items():
        for fil in glob.glob(os.path.join(directory, label, fname2)):
            try:
                os.unlink(fil)
            except:
                pass


def get_color_type(path):
    res = get_command_output(
        'convert "%s" -resize 100x100 -fx "u*((r+g+b)>=0.1)" -colorspace HSL -channel g -separate +channel -format "%%[fx:mean]" info:' % (
            path,))
    c = float(res.split()[0])
    return 'grayscale' if c < 0.1 else 'color'
