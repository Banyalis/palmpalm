# -*- coding: utf-8 -*-

from django.http import Http404
from rest_framework import status
from rest_framework.response import Response


class PartialUpdateModelMixin(object):
    """
    Update a model instance.
    Should be mixed in with `SingleObjectBaseView`.
    """

    def get_object(self):
        try:
            return super(PartialUpdateModelMixin, self).get_object()
        except AssertionError:
            return None

    def update(self, request, *args, **kwargs):
        if not isinstance(request.data, list):
            return super(PartialUpdateModelMixin, self).update(request, *args, **kwargs)

        self.action = 'list'
        partial = kwargs.pop('partial', False)
        instances = self.get_queryset()
        serializer = self.get_serializer(instances, data=request.data, partial=partial, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


# class PartialUpdateModelMixin(object):
#     """
#     Update a model instance.
#     """
#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
#
#         if getattr(instance, '_prefetched_objects_cache', None):
#             # If 'prefetch_related' has been applied to a queryset, we need to
#             # forcibly invalidate the prefetch cache on the instance.
#             instance._prefetched_objects_cache = {}
#
#         return Response(serializer.data)
#
