from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from django.db import transaction
import json

AGENCY_KEY = "123"


class RegistrationView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            username = request.data['username']
            password = request.data['password']
            role = request.data['role']

            if not username or not password or role not in ['nr', 'as']:
                return Response({
                    "message": "Users must have a username, password and a role"
                },
                    status=status.HTTP_400_BAD_REQUEST)

            if role == 'as' and request.data['agencyKey'] != AGENCY_KEY:
                return Response({
                    "message": "No authorization was provided",
                }, status=status.HTTP_401_UNAUTHORIZED)

            user = User.objects.create_user(username=username, password=password)
            token = Token.objects.create(user=user)
        except Exception as error:
            print(error)
            return Response({
                "message": "Internal server error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {
                "message": "Registration succeeded",
                "id": user.id,
                "username": user.get_username(),
                "role": role,
                "token": token.key
            }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def list(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided")


class RequestInformationNoteView(viewsets.ModelViewSet):
    queryset = RequestInformationNote.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        request_data = json.loads(request.data['data']) # convert json data string to python dict
        user = request.user
        requester = request_data['requesterForm']
        field = request_data['fieldForm']
        capacityCalculation = request_data['capacityCalculationForm']
        # document = request.data['requestInformationNote']['documentForm']

        user = User.objects.get(id=user.id)  # check for existance

        requesterInformationNote = RequesterInformationNote.objects.create(
            nationalIdCard=requester['nationalIdCard'],
            lastName=requester['lastName'], firstName=requester['firstName'],
            profession=requester['profession'],
            address=requester['address'], phoneNumber=requester['phoneNumber'], email=requester['email'],
            user=user)

        requestInformationNote = RequestInformationNote.objects.create(requesterInformationNote=requesterInformationNote)

        fieldInformation = FieldInformation.objects.create(
            groundInformationSector=field['groundInformationSector'],
            municipality=field['municipality'], landTitleNumber=field['landTitleNumber'],
            requisitionNumber=field['requisitionNumber'], calledProperty=field['calledProperty'],
            capacityCalculation=capacityCalculation)

        attachedDocument = AttachedDocument.objects.create(requestInformationNote=request.FILES['requestInformationNote'],
                                            ownershipCertificate=request.FILES['ownershipCertificate'],
                                            cadatralMap=request.FILES['cadatralMap'],
                                            nationalIdCard=request.FILES['nationalIdCard'])

        RequestInformationContent.objects.create(requestInformationNote=requestInformationNote,
                                                 fieldInformation=fieldInformation, attachedDocument=attachedDocument)

        return Response("Correctly sent", status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def list(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided")


class AgencyProfileView(viewsets.ModelViewSet):
    queryset = AgencyStaff.objects.all()
    serializer_class = AgencyStaffSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        user = request.user

        agencyStaffProfile = request.data['agencyStaffProfile']

        print(agencyStaffProfile)

        user = User.objects.get(id=user.id)  # check for existance

        agencyStaff = AgencyStaff.objects.update_or_create(
            nationalIdCard=agencyStaffProfile['nationalIdCard'],
            lastName=agencyStaffProfile['lastName'], firstName=agencyStaffProfile['firstName'],
            department=agencyStaffProfile['department'], profession=agencyStaffProfile['profession'],
            email=agencyStaffProfile['email'], phoneNumber=agencyStaffProfile['phoneNumber'], address=agencyStaffProfile['address'],
            user=user)

        serializer = AgencyStaffSerializer(agencyStaff)

        request_data = {
            "data_sent": serializer.data
        }
        return Response(request_data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):

        user = request.user

        agencyStaffProfile = AgencyStaff.objects.get(user=user)

        serializer = AgencyStaffSerializer(agencyStaffProfile)

        request_data = {
            "agencyStaffProfile": serializer.data
        }
        return Response(request_data, status=status.HTTP_200_OK)



    def update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided")


















