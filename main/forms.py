import datetime
from django import forms


class AppointmentForm(forms.ModelForm):
    name = forms.CharField(max_length=100)
    pet_name = forms.CharField(max_length=100)
    phone = forms.CharField(max_length=16)
    email = forms.EmailField()
    date_of_appointment = forms.DateField(default=datetime.date.today)
    time_of_appointment = forms.TimeField(default='10:00')
