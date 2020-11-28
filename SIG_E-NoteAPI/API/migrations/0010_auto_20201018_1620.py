# Generated by Django 3.1 on 2020-10-18 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0009_requestinformationverification_rejection_message'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='capacityAdopted_correspondence',
        ),
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='capacityCalculation_validity',
        ),
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='landTitleNumber_correspondence',
        ),
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='noteRequester_correspondence',
        ),
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='rejection_message',
        ),
        migrations.AlterField(
            model_name='requestinformationverification',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]