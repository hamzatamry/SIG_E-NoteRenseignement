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


class AgencyStaffSerializer(serializers.ModelSerializer):

    class Meta:
        model = AgencyStaff
        fields = ('id', 'nationalIdCard', 'lastName', 'firstName', 'department', 'profession', 'email', 'phoneNumber', 'address')


class RequestInformationNoteSerializer(serializers.ModelSerializer):
    requesterInformationNote = RequesterInformationNoteSerializer(many=False)

    class Meta:
        model = RequestInformationNote
        fields = ('id', 'state', 'sendingDate', 'requesterInformationNote')


class FieldInformationSerializer(serializers.ModelSerializer):

    class Meta:
        model = FieldInformation
        fields = ('id', 'groundInformationSector', 'municipality', 'landTitleNumber', 'requisitionNumber', 'calledProperty', 'capacityCalculation')


class AttachedDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = AttachedDocument
        fields = ('id', 'nationalIdCard', 'ownershipCertificate', 'cadatralMap', 'capacityCalculation')


class RequestInformationContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestInformationContent
        fields = ('id', 'requestInformationNote', 'fieldInformation', 'attachedDocument')