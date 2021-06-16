from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

import requests
import os

from .models import City

OPENWEATHER_API = os.environ['OPENWEATHER_APIKEY']
OPENWEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/'

def index(request):
    """
    Home page
    Response Type: Html
    """
    cities = City.objects.all()
    return render(request, 'weather_finder/index.html', {'cities': cities})

def forecast(request, city_slug=None):
    """
    Forecast page show the future weather condition 
    for a particular city.
    Response Type: Html
    """
    city = City.objects.get(slug=city_slug)
    req =  requests.get(OPENWEATHER_BASE_URL + 'forecast', 
            params={
                'appid': OPENWEATHER_API,
                'q': city.title,
                'units': 'metric'
            }, headers={'content-type': 'application/json'})
    return render(request, 'weather_finder/forecast.html', 
            {'city': city, 'weather_data': req.json()})

def check_by_location(request, city_slug=None):
    """
    Get the current weather details of a particular city
    Response Type: Json
    """
    city = City.objects.get(slug=city_slug)
    if city:
        req =  requests.get(OPENWEATHER_BASE_URL + 'weather', 
        params={
            'appid': OPENWEATHER_API,
            'q': city.title,
            'units': 'metric'
        }, headers={'content-type': 'application/json'})
        return JsonResponse(req.json())
    else:
        return HttpResponse({}, content_type='application/json', status=404)


