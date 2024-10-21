from django.urls import path, include
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'appointment', AppointmentViewSet, basename='appointment')
router.register(r'company', CompanyViewSet, basename='company')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', index, name='index'),
    path('api/', include(router.urls)),
]