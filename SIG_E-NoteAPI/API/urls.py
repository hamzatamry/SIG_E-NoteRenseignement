from django.urls import path, include
from .views import *

from rest_framework import routers

router = routers.DefaultRouter()
router.register('register', RegistrationView)
router.register('noteRequestInformation', RequestInformationNoteView)
router.register('AgencyProfile', AgencyProfileView)


urlpatterns = [
    path('', include(router.urls))
]