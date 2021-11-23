# -*- coding: utf-8 -*-

from django.views.generic import TemplateView

from django.conf import settings


# base view, parent for others
class BaseView(TemplateView):

    template_name = 'control/Base.jinja'

    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)

        # print(models.Page.objects.all())

        # from mosbrew.tasks import check_agent_inbox
        # check_agent_inbox.delay()

        # from mosbrew.models import AgentMessage
        # AgentMessage.objects.get(id=19).send_smtp()

        # import os
        # from mosbrew.models import AgentMessage
        # with open(os.path.join(settings.BASE_DIR, '1.eml'), 'rb') as f:
        #     AgentMessage.parse_email(f.read())

        return context
