from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField, HStoreField
from django.contrib.auth.models import User


class RequesterInformationNote(models.Model):
    id = models.AutoField(primary_key=True)
    nationalIdCard = models.CharField(max_length=50, null=True)
    lastName = models.CharField(max_length=50, null=True)
    firstName = models.CharField(max_length=50, null=True)
    profession = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=250, null=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    email = models.EmailField(max_length=60, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)


class AgencyStaff(models.Model):
    id = models.AutoField(primary_key=True)
    nationalIdCard = models.CharField(max_length=50, blank=False, null=True)
    lastName = models.CharField(max_length=50, blank=False)
    firstName = models.CharField(max_length=50, blank=False)
    department = models.CharField(max_length=50, blank=False)
    profession = models.CharField(max_length=50, blank=False)
    email = models.CharField(max_length=60, blank=False, unique=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    address = models.CharField(max_length=250, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)


class RequestInformationNote(models.Model):
    id = models.AutoField(primary_key=True)
    state = models.CharField(max_length=1, blank=False, default='p') # p for in progess
    rejection_message = models.CharField(max_length=200, null=True)
    sendingDate = models.DateTimeField(auto_now=True)
    requesterInformationNote = models.ForeignKey(RequesterInformationNote, on_delete=models.CASCADE, null=False)
    groundInformationSector = models.CharField(max_length=50, blank=False)
    municipality = models.CharField(max_length=50, blank=False)
    landTitleNumber = models.IntegerField(null=True)
    requisitionNumber = models.IntegerField(null=True)
    calledProperty = models.CharField(max_length=50, null=True)
    capacityCalculation = ArrayField(HStoreField(), size=10)
    requestInformationNote = models.FileField(upload_to='docs/rin', null=False)
    ownershipCertificate = models.FileField(upload_to='docs/oc', null=False)
    cadatralMap = models.FileField(upload_to='docs/cm', null=False)
    nationalIdCard = models.FileField(upload_to='docs/nid', null=False)


class RequestInformationVerification(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=False)
    requestInformationNote = models.ForeignKey(RequestInformationNote, on_delete=models.CASCADE, null=False)


class Publication(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, blank=False, null=False)
    date = models.DateField(auto_now=True)
    description = models.TextField(max_length=500, blank=False, null=False)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=False)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(auto_now_add=True)
    message = models.CharField(max_length=100, null=False)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=False)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, null=False, related_name='comments')


class PublishedFile(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(upload_to='pub/')
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, null=False, related_name='files')


class InformationNote(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    document = models.FileField(upload_to='information_note', null=False)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=False)
    noteInformationRequester = models.ForeignKey(RequesterInformationNote, on_delete=models.CASCADE, null=False)








