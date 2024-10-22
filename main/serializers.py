from rest_framework import serializers

from .models import ServiceModel, AppointmentModel, CompanyModel, ReviewsModel


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceModel
        fields = ['id', 'name', 'detail', 'cost', 'is_active']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentModel
        fields = ['id', 'service','name', 'pet_name', 'phone', 'email',
                  'date_of_appointment', 'time_of_appointment', 'approved']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyModel
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewsModel
        fields = '__all__'
