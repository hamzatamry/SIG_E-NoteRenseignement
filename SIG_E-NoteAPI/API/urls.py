from django.urls import path, include
from .views import JsonCBV, SerializedListView

urlpatterns = [
    path('cbv/', JsonCBV.as_view()),
    path('serialized/list/', SerializedListView.as_view())

]