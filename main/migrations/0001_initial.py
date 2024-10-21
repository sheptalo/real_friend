# Generated by Django 5.1.2 on 2024-10-15 14:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AppointmentModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('pet_name', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=16)),
                ('email', models.EmailField(max_length=254)),
                ('date_of_appointment', models.DateField(default=datetime.date.today)),
                ('time_of_appointment', models.TimeField(default='10:00')),
                ('approved', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='CompanyModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('addres', models.CharField(max_length=100)),
                ('work_time', models.TimeField()),
                ('phone', models.CharField(max_length=16)),
                ('email', models.EmailField(max_length=254)),
                ('links', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='ReviewsModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('content', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ServiceModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('detail', models.TextField()),
                ('cost', models.IntegerField()),
                ('is_active', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ('-name',),
            },
        ),
    ]