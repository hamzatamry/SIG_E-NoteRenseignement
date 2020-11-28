from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {
            'password':  {
                'write_only': True,
                'required': True
            }
        }


class RequesterInformationNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequesterInformationNote
        fields = ('id', 'nationalIdCard', 'lastName', 'firstName', 'profession', 'address', 'phoneNumber', 'email')


class AgencyStaffMiniSerializer(serializers.ModelSerializer):

    class Meta:
        model = AgencyStaff
        fields = ('id', 'lastName', 'firstName', 'department')


class AgencyStaffSerializer(serializers.ModelSerializer):

    class Meta:
        model = AgencyStaff
        fields = ('id', 'nationalIdCard', 'lastName', 'firstName', 'department', 'profession', 'email', 'phoneNumber', 'address')


class RequestInformationNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestInformationNote
        fields = ('id', 'state', 'sendingDate')


class RequestInformationNoteDetailSerializer(serializers.ModelSerializer):
    requesterInformationNote = RequesterInformationNoteSerializer(many=False)
    requestInformationNote = serializers.SerializerMethodField()
    ownershipCertificate = serializers.SerializerMethodField()
    cadatralMap = serializers.SerializerMethodField()
    nationalIdCard = serializers.SerializerMethodField()

    class Meta:
        model = RequestInformationNote
        fields = ('requesterInformationNote', 'groundInformationSector', 'municipality', 'landTitleNumber',
                  'requisitionNumber', 'calledProperty', 'requestInformationNote', 'ownershipCertificate',
                  'cadatralMap', 'nationalIdCard', 'rejection_message')

    def get_requestInformationNote(self, instance):
        return instance.requestInformationNote.name[9:]

    def get_ownershipCertificate(self, instance):
        return instance.ownershipCertificate.name[8:]

    def get_cadatralMap(self, instance):
        return instance.cadatralMap.name[8:]

    def get_nationalIdCard(self, instance):
        return instance.nationalIdCard.name[9:]


class RequestInformationNoteFieldSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestInformationNote
        fields = ('groundInformationSector', 'municipality', 'landTitleNumber', 'requisitionNumber', 'calledProperty', 'capacityCalculation')


class CommentSerializer(serializers.ModelSerializer):
    agencyStaff = AgencyStaffMiniSerializer(many=False)

    class Meta:
        model = Comment
        fields = ('id', 'date', 'message', 'agencyStaff')


class PublishedFileSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = PublishedFile
        fields = ('id', 'file')

    def get_file(self, instance):
        return instance.file.name[4:]


class PublicationSerializer(serializers.ModelSerializer):
    agencyStaff = AgencyStaffMiniSerializer(many=False)
    comments = CommentSerializer(many=True)
    files = PublishedFileSerializer(many=True)

    class Meta:
        model = Publication
        fields = ('id', 'title', 'date', 'description', 'agencyStaff', 'comments', 'files')


class InformationNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InformationNote
        fields = ('id', 'date', 'document')






