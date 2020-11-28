from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.core.exceptions import *
from .models import *
from .serializers import *
from django.db import transaction
import json

from django.http import FileResponse

AGENCY_KEY = "123"
VALIDATION_KEY = "456"
UPLOAD_KEY = "789"


class RegistrationView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

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
    serializer_class = RequestInformationNoteSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        user = request.user
        request_data = json.loads(request.data['data'])  # convert json data string to python dict
        requester = request_data['requesterForm']
        field = request_data['fieldForm']
        capacityCalculation = request_data['capacityCalculationForm']

        # create the requester
        requesterInformationNote = RequesterInformationNote.objects.create(
            nationalIdCard=requester['nationalIdCard'],
            lastName=requester['lastName'], firstName=requester['firstName'],
            profession=requester['profession'],
            address=requester['address'], phoneNumber=requester['phoneNumber'], email=requester['email'],
            user=user)

        # create the request
        requestInformationNote = RequestInformationNote.objects.create(
            # requester information
            requesterInformationNote=requesterInformationNote,
            # field information
            groundInformationSector=field['groundInformationSector'], municipality=field['municipality'], landTitleNumber=field['landTitleNumber'],
            requisitionNumber=field['requisitionNumber'], calledProperty=field['calledProperty'], capacityCalculation=capacityCalculation,
            # file upload
            requestInformationNote = request.FILES['requestInformationNote'], ownershipCertificate = request.FILES['ownershipCertificate'],
            cadatralMap = request.FILES['cadatralMap'], nationalIdCard = request.FILES['nationalIdCard'])

        return Response("Correctly sent", status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        requestInformationsNotes = RequestInformationNote.objects.all().order_by('-id')[int(pk):int(pk) + 6]
        serializer = RequestInformationNoteSerializer(requestInformationsNotes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):

        if ('validation_key' not in request.data) or request.data['validation_key'] != VALIDATION_KEY:
            print(request.data)
            return Response({
                "message": "No authorization were provided"
            }, status=status.HTTP_401_UNAUTHORIZED)

        state = request.data['state']

        if 'rejection_message' in request.data:
            rejection_message = request.data['rejection_message']

        try:
            requestInformationNote = RequestInformationNote.objects.filter(id=pk)
            requestInformationNote.update(state=state)

            if state == 'r':
                requestInformationNote.update(rejection_message=rejection_message)
            else:
                requestInformationNote.update(rejection_message=None)

        except ObjectDoesNotExist:
            return Response({
                "message": "Not found"
            }, status=status.HTTP_404_NOT_FOUND)
        else:

            return Response({
                "message": "Successfully saved",
                "state": requestInformationNote[0].state
            }, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):

        try:
            user = request.user
            requesterInformationNotes = RequesterInformationNote.objects.filter(user=user)
            requests = []

            for requester in requesterInformationNotes:
                request = RequestInformationNote.objects.get(requesterInformationNote=requester)
                requests.append(request)

            for request in requests:
                print(request)

        except Exception as error:
            print(error)

            return Response({
                "message": "Internal Server Error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            serializer = RequestInformationNoteSerializer(requests, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided")

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided")


class RequestInformationNoteDetailView(viewsets.ModelViewSet):
    queryset = RequestInformationNote.objects.all()
    serializer_class = RequestInformationNoteDetailSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk=None):
        requestInformationNotes = RequestInformationNote.objects.get(id=pk)
        serializer = RequestInformationNoteDetailSerializer(requestInformationNotes, many=False)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
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
    permission_classes = (IsAuthenticated,)

    # create or update agency staff profile
    def create(self, request, *args, **kwargs):
        user = request.user

        agencyStaffProfile = request.data['agencyStaffProfile']

        user = User.objects.get(id=user.id)  # check for existance

        try:
            agencyStaff = AgencyStaff.objects.filter(user=user) # check if agencyStaff already exists*
            if len(agencyStaff) == 0:
                raise ObjectDoesNotExist()
        except ObjectDoesNotExist as error:
            AgencyStaff.objects.create(
                nationalIdCard=agencyStaffProfile['nationalIdCard'],
                lastName=agencyStaffProfile['lastName'], firstName=agencyStaffProfile['firstName'],
                department=agencyStaffProfile['department'], profession=agencyStaffProfile['profession'],
                email=agencyStaffProfile['email'], phoneNumber=agencyStaffProfile['phoneNumber'],
                address=agencyStaffProfile['address'],
                user=user)

            return Response({
                "message": "Profile created"
            }, status=status.HTTP_200_OK)
        else:
            agencyStaff.update(
            nationalIdCard=agencyStaffProfile['nationalIdCard'],
            lastName=agencyStaffProfile['lastName'], firstName=agencyStaffProfile['firstName'],
            department=agencyStaffProfile['department'], profession=agencyStaffProfile['profession'],
            email=agencyStaffProfile['email'], phoneNumber=agencyStaffProfile['phoneNumber'],
            address=agencyStaffProfile['address'])

            return Response({
                "message": "Profile updated"
            }, status=status.HTTP_200_OK)


    # get agency staff profile
    def list(self, request, *args, **kwargs):

        user = request.user

        agencyStaffProfile = AgencyStaff.objects.get(user=user)

        serializer = AgencyStaffSerializer(agencyStaffProfile, many=False)

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


class PublicationView(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        user = request.user

        request_data = json.loads(request.data['publication'])  # convert json data string to python dict

        print(user)
        print(request_data)
        # retrieve the agencyStaff that match the user
        agencyStaff = AgencyStaff.objects.get(user=user)

        # creating publication
        publication = Publication.objects.create(title=request_data['title'], date=request_data['date'],
                                                 description=request_data['description'], agencyStaff=agencyStaff)

        # adding files to database
        for key in request.FILES:
            PublishedFile.objects.create(file=request.FILES[key], publication=publication)

        serializer = PublicationSerializer(publication, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        publications = Publication.objects.all().order_by('-id')[int(pk):int(pk) + 5]
        serializer = PublicationSerializer(publications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request, pk=None):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def update(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)


class CommentView(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):

        user = request.user
        request_data = request.data

        print(request_data)

        publication = Publication.objects.get(id=request_data['id'])
        agencyStaff = AgencyStaff.objects.get(user=user)

        comment = Comment.objects.create(message=request_data['message'], agencyStaff=agencyStaff, publication=publication)

        serializer = CommentSerializer(comment, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def retrieve(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def update(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)


class PublishedFileView(viewsets.ModelViewSet):
    queryset = PublishedFile.objects.all()
    serializer_class = PublicationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk=None):
        file = PublishedFile.objects.get(id=pk)
        file_path = "media/" + str(file.file)
        try:
            return FileResponse(open(file_path, 'rb'), filename=file_path[10:])

        except IOError as err:
            return Response("file not found")

    def update(self, request, pk=None):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def create(self, request,  pk=None):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def list(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)


class RequestFileView(viewsets.ModelViewSet):
    queryset = RequestInformationNote.objects.all()
    serializer_class = RequestInformationNoteSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    def retrieve(self, request, pk=None):

        file_type = request.GET.get('file_type')

        requestInformationNote = RequestInformationNote.objects.get(id=pk)

        ROOT = "media/"

        switcher = {
            'cm': ROOT + str(requestInformationNote.cadatralMap),
            'nid': ROOT + str(requestInformationNote.nationalIdCard),
            'oc': ROOT + str(requestInformationNote.ownershipCertificate),
            'rin': ROOT + str(requestInformationNote.requestInformationNote)
        }

        try:
            return FileResponse(open(switcher.get(file_type), 'rb'))

        except IOError as err:
            return Response("file not found")

        return Response("received")

    def update(self, request, pk=None):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def create(self, request,  pk=None):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def list(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def partial_update(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, *args, **kwargs):
        return Response("No authorization was provided", status=status.HTTP_401_UNAUTHORIZED)


class InformationNoteView(viewsets.ModelViewSet):
    queryset = InformationNote.objects.all()
    serializer_class = InformationNoteSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            user = request.user
            if 'upload_key' in request.data:
                upload_key = request.data['upload_key'][1:len(request.data['upload_key']) - 1]

                if upload_key != UPLOAD_KEY:
                    return Response({
                        "message": "No Authorization was provided"
                    }, status=status.HTTP_401_UNAUTHORIZED)

            if 'document' not in request.FILES:
                raise ObjectDoesNotExist()
            else:
                agencyStaff = AgencyStaff.objects.get(user=user)
                InformationNote.objects.create(document=request.FILES['document'], agencyStaff=agencyStaff)

        except Exception as error:
            return Response({
                "message": "Server Error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({
                "message": "received"
            }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return Response({
            "message": "received"
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        print(request.data)
        try:
            if 'validation_key' not in request.data or 'state' not in request.data:
                raise Exception()
            else:
                if request.data['validation_key'] != VALIDATION_KEY or request.data['state'] != 'v':
                    raise Exception()
        except Exception as error:
            print(error)
            return Response({
                "message": "No Authorization was provided"
            }, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({
                "message": "Accepted"
            }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return Response({
            "message": "No Authorization was provided"
        }, status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, *args, **kwargs):
        return Response({
            "message": "No Authorization was provided"
        }, status=status.HTTP_401_UNAUTHORIZED)