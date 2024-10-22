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
    return JsonResponse({"logged":request.user.is_authenticated})


def all_services(request):
    if request.user.is_authenticated:
        return JsonResponse(ServiceSerializer(ServiceModel.objects.all(), many=True).data, safe=False)


class ServiceViewSet(ModelViewSet):
    queryset = ServiceModel.objects.all()
    serializer_class = ServiceSerializer

    def list(self, request, *args, **kwargs):
        service = ServiceModel.objects.all().filter(is_active=True).order_by('cost')
        serializer = ServiceSerializer(service, many=True)
        return Response(serializer.data)


class AppointmentViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer

    def create(self, request, *args, **kwargs):
        req = HttpResponseRedirect('http://127.0.0.1:3000')
        req.set_cookie('success', False)

        if AppointmentModel(request.POST).check_conflicts():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            req.set_cookie('success', True)
            req.headers = headers
            # return redirect('http://localhost:3000', headers=headers, status=status.HTTP_201_CREATED)
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
