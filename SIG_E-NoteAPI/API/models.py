from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField


class RequesterInformationNote(models.Model):
    nationalIdCard = models.CharField(max_length=50, null=True, unique=True)
    lastName = models.CharField(max_length=50, null=True)
    firstName = models.CharField(max_length=50, null=True)
    profession = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=250, null=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    role = models.CharField(max_length=1, blank=False)
    email = models.EmailField(max_length=60, blank=True, unique=True)
    username = models.CharField(max_length=30, blank=True, unique=True)
    password = models.CharField(max_length=50, blank=False)
    # token ?


class AgencyStaff(models.Model):
    lastName = models.CharField(max_length=50, blank=False)
    firstName = models.CharField(max_length=50, blank=False)
    department = models.CharField(max_length=50, blank=False)
    job = models.CharField(max_length=50, blank=False)
    role = models.CharField(blank=False,
                            max_length=3,
                            choices=(
                                ('NIR', 'noteInformationRequester'),
                                ('AS', 'agencyStaff')
                            ))
    email = models.CharField(max_length=60, blank=False, unique=True)
    username = models.CharField(max_length=30, blank=True, unique=True)
    password = models.CharField(max_length=50, blank=False)
    # token ?


class Publication(models.Model):
    description = models.TextField(max_length=500, blank=False)
    file = models.FileField(upload_to='pub/files', null=True)
    agencyStaff = models.ForeignKey(AgencyStaff, on_delete=models.CASCADE, null=True)


class RequestInformationNote(models.Model):
    state = models.CharField(max_length=1, blank=False)
    sendingDate = models.DateField(auto_now=True)
    requesterInformationNote = models.ForeignKey(RequesterInformationNote, on_delete=models.CASCADE, null=True)


class FieldInformation(models.Model):
    groundInformationSector = models.CharField(max_length=50, blank=False)
    municipality = models.CharField(max_length=50, blank=False)
    landTitleNumber = models.IntegerField(null=True)
    requisitionNumber = models.IntegerField(null=True)
    calledProperty = models.CharField(max_length=50, null=True)


class AttachedDocument(models.Model):
    nationalIdCard = models.ImageField(upload_to='docs/nid')
    ownershipCertificate = models.ImageField(upload_to='docs/oc')
    cadatralMap = models.ImageField(upload_to='docs/cm')
    capacityCalculation = models.ImageField(upload_to='docs/cc')


class CapacityCalculation(models.Model):
    xCoordinates = ArrayField(models.FloatField(), null=True)
    yCoordinates = ArrayField(models.FloatField(), null=True)
    bounds = ArrayField(models.CharField(max_length=5), null=True)
    reference = models.CharField(max_length=20, null=True)


class RequestInformationContent(models.Model):
    pass


class RequestInformationVerification(models.Model):
    pass








