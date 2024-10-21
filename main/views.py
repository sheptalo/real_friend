import random

from django.db.models import QuerySet
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import CompanyModel, ServiceModel, AppointmentModel, ReviewsModel
from .serializers import ServiceSerializer, AppointmentSerializer, CompanySerializer, ReviewSerializer


def index(request):
    services = ServiceModel.objects.all().filter(is_active=True)
    contact = CompanyModel.objects.get(pk=1)
    form = ''
    return render(request, 'index.html', {
        'services': services,
        'company': contact,
        'appointment_form': form,
    })


class ServiceViewSet(ModelViewSet):
    queryset = ServiceModel.objects.all()
    serializer_class = ServiceSerializer

    def list(self, request, *args, **kwargs):
        service = ServiceModel.objects.all().filter(is_active=True)
        serializer = ServiceSerializer(service, many=True)
        return Response(serializer.data)


class AppointmentViewSet(ModelViewSet):
    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer


class CompanyViewSet(ModelViewSet):
    queryset = CompanyModel.objects.all()
    serializer_class = CompanySerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = ReviewsModel.objects.all()
    serializer_class = ReviewSerializer

    def list(self, request, *args, **kwargs):
        res = ReviewsModel.objects.order_by('?')[:5]
        ser = ReviewSerializer(res, many=True)
        return Response(ser.data)
