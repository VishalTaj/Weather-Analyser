from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='root_url'),
    path('check_by_location/<city_slug>/', views.check_by_location, name='check_by_location'),
    path('forecast/<city_slug>/', views.forecast, name='forecast'),
]