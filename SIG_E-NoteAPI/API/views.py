from django.http import HttpResponse, JsonResponse
from django.views.generic import View
from .models import Publication
from django.core.serializers import serialize
import json


class JsonCBV(View):
    def get(self, request):
        data = {
            "count": 1000,
            "content": "Some new content"
        }
        return JsonResponse(data)


class SerializedListView(View):
    def get(self, request, *args, **kwargs):
        qs = Publication.objects.filter(id=1)
        data = serialize("json", qs)
        return HttpResponse(data, content_type='application/json')

    def put(self, request, *args, **kwargs):
        data = json.dumps({
            "message": "nop"
        })
        return HttpResponse(data, content_type='application/json')

