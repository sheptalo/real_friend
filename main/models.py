import datetime

from django.db import models


# Create your models here.
class ServiceModel(models.Model):
    name = models.CharField(max_length=100)
    detail = models.TextField()
    cost = models.IntegerField()
    is_active = models.BooleanField(default=False)

    class Meta:
        ordering = ('-name',)

    def __str__(self):
        return self.name


class AppointmentModel(models.Model):
    name = models.CharField(max_length=100)
    pet_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=16)
    email = models.EmailField()
    date_of_appointment = models.DateField(default=datetime.date.today)
    time_of_appointment = models.TimeField(default='10:00')
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def check_conflicts(self):
        # Получаем текущую дату и время начала бронирования
        current_date = self.date_of_appointment
        current_time = self.time_of_appointment
        current_datetime = datetime.datetime.combine(current_date, current_time)
        existing_appointments = AppointmentModel.objects.filter(
            start_time__lte=current_datetime,
            end_time__gte=current_datetime
        ).exclude(owner=self).all()
        return True if existing_appointments else False


class ReviewsModel(models.Model):
    name = models.CharField(max_length=100)
    content = models.TextField()

    def __str__(self):
        return self.name


class CompanyModel(models.Model):
    name = models.CharField(max_length=100)
    slogan = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    addres = models.CharField(max_length=100)
    start_work_time = models.TimeField()
    end_work_time = models.TimeField()
    phone = models.CharField(max_length=16)
    email = models.EmailField()
    links = models.URLField()

    def __str__(self):
        return 'Contacts'