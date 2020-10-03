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
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)


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

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(auto_now_add=True, blank=False, null=True)
    message = models.CharField(max_length=100, blank=False, null=True)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=True)


class Publication(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, blank=False, null=True)
    date = models.DateField(auto_now=True, null=True)
    description = models.TextField(max_length=500, blank=False, null=True)
    files = ArrayField(models.FileField(upload_to='pub/files', null=True), size=10, null=True)
    comments = models.ManyToManyField(Comment)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=True)


class RequestInformationNote(models.Model):
    id = models.AutoField(primary_key=True)
    state = models.CharField(max_length=10, blank=False, default='progress') # p for in progess
    sendingDate = models.DateTimeField(auto_now=True)
    requesterInformationNote = models.ForeignKey(RequesterInformationNote, on_delete=models.CASCADE, null=True)


class FieldInformation(models.Model):
    id = models.AutoField(primary_key=True)
    groundInformationSector = models.CharField(max_length=50, blank=False)
    municipality = models.CharField(max_length=50, blank=False)
    landTitleNumber = models.IntegerField(null=True)
    requisitionNumber = models.IntegerField(null=True)
    calledProperty = models.CharField(max_length=50, null=True)
    capacityCalculation = ArrayField(HStoreField(), size=10)


class AttachedDocument(models.Model):
    id = models.AutoField(primary_key=True)
    requestInformationNote = models.FileField(upload_to='docs/rin', null=True)
    ownershipCertificate = models.FileField(upload_to='docs/oc')
    cadatralMap = models.FileField(upload_to='docs/cm')
    nationalIdCard = models.FileField(upload_to='docs/nid')


class RequestInformationContent(models.Model):
    id = models.AutoField(primary_key=True)
    requestInformationNote = models.ForeignKey(RequestInformationNote, on_delete=models.CASCADE, null=False)
    fieldInformation = models.ForeignKey(FieldInformation, on_delete=models.CASCADE, null=False)
    attachedDocument = models.ForeignKey(AttachedDocument, on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together = [['requestInformationNote', 'fieldInformation', 'attachedDocument'], ]
        index_together = [['requestInformationNote', 'fieldInformation', 'attachedDocument'], ]


class RequestInformationVerification(models.Model):
    id = models.AutoField(primary_key=True)
    requesterInformation = models.ForeignKey(RequesterInformationNote, on_delete=models.CASCADE, null=True)







