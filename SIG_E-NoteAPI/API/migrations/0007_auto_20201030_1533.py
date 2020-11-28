# Generated by Django 3.1 on 2020-10-30 14:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0006_auto_20201030_1507'),
    ]

    operations = [
        migrations.RenameField(
            model_name='informationnote',
            old_name='saving_date',
            new_name='date',
        ),
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='rejection_message',
        ),
        migrations.RemoveField(
            model_name='requestinformationverification',
            name='state',
        ),
        migrations.AddField(
            model_name='requestinformationnote',
            name='rejection_message',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='requestinformationnote',
            name='state',
            field=models.CharField(default='p', max_length=1),
        ),
        migrations.AlterField(
            model_name='requestinformationverification',
            name='agencyStaff',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.agencystaff'),
        ),
        migrations.AlterField(
            model_name='requestinformationverification',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
