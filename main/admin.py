from django.contrib import admin

from .models import AppointmentModel, CompanyModel, ServiceModel, ReviewsModel

admin.site.register(AppointmentModel)
admin.site.register(CompanyModel)
admin.site.register(ServiceModel)
admin.site.register(ReviewsModel)
