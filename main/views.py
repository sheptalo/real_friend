import datetime
from string import ascii_letters

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import CompanyModel, ServiceModel, AppointmentModel, ReviewsModel
from .serializers import ServiceSerializer, AppointmentSerializer, CompanySerializer, ReviewSerializer


@csrf_exempt
def login_admin(request):
    if request.method == 'POST':
        user = authenticate(request, username=request.POST.get('username'), password=request.POST.get('password'))

        if user:
            login(request, user)

            return redirect('http://127.0.0.1:3000', kwargs={'result': 'success'})
        return redirect('http://127.0.0.1:3000', kwargs={'result': 'failed'})


def check_user_logged(request):
    return JsonResponse({"logged": request.user.is_authenticated})


def all_services(request):
    if request.user.is_authenticated:
        return JsonResponse(ServiceSerializer(ServiceModel.objects.all(), many=True).data, safe=False)


class ServiceViewSet(ModelViewSet):
    queryset = ServiceModel.objects.all()
    serializer_class = ServiceSerializer

    def list(self, request, *args, **kwargs):
        minimum = request.GET.get('min', 0)
        maximum = request.GET.get('max', 100000000)
        sort = request.GET.get('sort', 'cost')
        service = (ServiceModel.objects.all().filter(is_active=True).order_by(sort)
                   .filter(cost__gte=minimum).filter(cost__lte=maximum))
        serializer = ServiceSerializer(service, many=True)
        return Response(serializer.data)


class AppointmentViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer

    def list(self, request, *args, **kwargs):
        filter = request.GET.get('filter', '-')
        today = datetime.date.today()

        if filter == 'today':
            obj = AppointmentModel.objects.filter(date_of_appointment="%s" % today.isoformat())
        elif filter == '?':
            obj = AppointmentModel.objects.all().order_by('?')
        elif filter in ['True', 'False']:
            obj = AppointmentModel.objects.filter(approved=eval(filter))
        else:
            obj = AppointmentModel.objects.all()
        print([i.date_of_appointment for i in obj], today)
        serializer = AppointmentSerializer(obj, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        req = HttpResponseRedirect('http://127.0.0.1:3000')
        req.set_cookie('success', 'False')
        data = {i: request.data[i] for i in request.data.keys() if i != 'csrfmiddlewaretoken'}
        hours = datetime.time(hour=int(data['time_of_appointment'].split(':')[0]),
                              minute=int(data['time_of_appointment'].split(':')[1]))
        date = datetime.date(*(int(i) for i in data['date_of_appointment'].split('-')))
        print(date)
        data['time_of_appointment'] = hours

        if AppointmentModel(**data).check_conflicts():
            name = request.POST.get('name')
            pet_name = request.POST.get('pet_name')
            for i in f'{name}':
                if i.lower() not in 'фйёцыячсвукамипенртьогшлбюдщзхъэж -.':
                    req.set_cookie('err', 'russian_name')
                    return req
            for i in pet_name:
                if i.lower() not in ascii_letters + 'фйцыячсёвукамипенртьогшлбюдщзхъэж -.':
                    req.set_cookie('err', 'pet_name')
                    return req
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            req.set_cookie('success', "True")
            return req
        req.set_cookie('err', 'exist')
        return req


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
