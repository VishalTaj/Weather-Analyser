from django import template    
register = template.Library()    

@register.filter('timestamp_to_time')
def timestamp_to_time(timestamp):
    import datetime
    return datetime.datetime.fromtimestamp(int(timestamp))

@register.filter('to_miles')
def to_miles(value):
    return round(value * 0.000621371192, 2)