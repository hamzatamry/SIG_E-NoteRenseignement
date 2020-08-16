from django.contrib.gis.db import models

class RequesterInformationNote(models.Model):
    nationalIdCard = models.CharField(max_length=50, null=True, unique=True)
    lastName = models.CharField(max_length=50, null=True)
    firstName = models.CharField(max_length=50, null=True)
    profession = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=250, null=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    role = models.CharField(max_length=1, blank=False)
    email = models.CharField(max_length=60, blank=True, unique=True)
    password = models.CharField(max_length=50, blank=False)


class AgencyStaff(models.Model):
    lastName = models.CharField(max_length=50, blank=False)
    firstName = models.CharField(max_length=50, blank=False)
    department = models.CharField(max_length=50, blank=False)
    job = models.CharField(max_length=50, blank=False)
    role = models.CharField(max_length=1, blank=False)
    email = models.CharField(max_length=60, blank=False, unique=True)
    password = models.CharField(max_length=50, blank=False)


class Publication(models.Model):
    description = models.CharField(max_length=500, blank=False)
    # ??
    # agencyStaff = models.ForeignKey()


class RequestInformationNote(models.Model):
    state = models.CharField(max_length=1, blank=False)
    sendingDate = models.DateField(auto_now=True)
    # requesterInformationNote = models.ForeignKey()


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


class RequestInformationContent(models.Model):
    pass


class RequestInformationVerification(models.Model):
    pass
    # ???
    # requestInformationNote = models.ForeignKey()


class CapacityCalculation(models.Model):
    pass
    # ???




