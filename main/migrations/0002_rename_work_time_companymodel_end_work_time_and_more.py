# Generated by Django 5.1.2 on 2024-10-15 14:20

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='companymodel',
            old_name='work_time',
            new_name='end_work_time',
        ),
        migrations.AddField(
            model_name='companymodel',
            name='start_work_time',
            field=models.TimeField(default=datetime.datetime(2024, 10, 15, 17, 20, 39, 861856)),
            preserve_default=False,
        ),
    ]