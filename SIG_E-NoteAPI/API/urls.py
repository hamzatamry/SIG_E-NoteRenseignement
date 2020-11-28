from django.urls import path, include
from .views import *

from rest_framework import routers

router = routers.DefaultRouter()
router.register('register', RegistrationView)
router.register('noteRequestInformation', RequestInformationNoteView)
router.register('noteRequestInformationDetail', RequestInformationNoteDetailView)
router.register('agencyProfile', AgencyProfileView)
router.register('publication', PublicationView)
router.register('comment', CommentView)
router.register('publishedFile', PublishedFileView)
router.register('requestFile', RequestFileView)
router.register('informationNote', InformationNoteView)


urlpatterns = [
    path('', include(router.urls))
]