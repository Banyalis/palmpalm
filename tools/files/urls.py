from django.conf.urls import url

from .views import upload_temp_file, upload_temp_files, upload_temp_file_image, upload_temp_files_image,\
   detect_color_type

urlpatterns = [
   url(r'^upload_temp_file/$', upload_temp_file, name='temp-file-upload'),
   url(r'^upload_temp_file/(\w+)/$', upload_temp_file, name='temp-file-upload-p'),
   url(r'^upload_temp_files/$', upload_temp_files, name='temp-file-uploads'),
   url(r'^upload_temp_files/(\w+)/$', upload_temp_files, name='temp-file-uploads-p'),

   url(r'^upload_temp_file_image/$', upload_temp_file_image, name='temp-file-upload-image'),
   url(r'^upload_temp_file_image/(\w+)/$', upload_temp_file_image, name='temp-file-upload-image-p'),
   url(r'^upload_temp_files_image/$', upload_temp_files_image, name='temp-file-uploads-image'),
   url(r'^upload_temp_files_image/(\w+)/$', upload_temp_files_image, name='temp-file-uploads-image-p'),

   url(r'^detect_color_type/$', detect_color_type, name='temp-file-detect-color-type'),
]
