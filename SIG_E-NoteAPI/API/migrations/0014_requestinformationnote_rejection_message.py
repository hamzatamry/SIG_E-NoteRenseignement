# Generated by Django 3.1 on 2020-10-20 15:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0013_auto_20201020_1549'),
    ]

    operations = [
        migrations.AddField(
            model_name='requestinformationnote',
            name='rejection_message',
            field=models.CharField(max_length=200, null=True),
        ),
    ]