# Generated by Django 3.1 on 2020-10-22 18:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0014_requestinformationnote_rejection_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='InformationNote',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('document', models.FileField(upload_to='information_note')),
                ('agencyStaff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.agencystaff')),
            ],
        ),
    ]