from django.shortcuts import render
from map.models import SensorTag
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def map_search(request):
    if request.method == 'GET':
        return render(request, 'map.html', {})
    elif request.method == 'POST':
        # Get POST data
        timestamp = request.POST.get('timestamp')
        tag_id= request.POST.get('id')
        altitude = request.POST.get('altitude')
        var_long = request.POST.get('long')
        sensor1 = request.POST.get('sensor1')
        sensor2 = request.POST.get('sensor2')
        sensor3 = request.POST.get('sensor3')
        sensor4 = request.POST.get('sensor4')
        tag = request.POST.get('tag')
        lat = request.POST.get('lat')

        filter_dict = {}

        # Get only _id and tag
        if tag_id != "":
            filter_dict['tag_id'] = tag_id
        if tag != "":
            filter_dict['tag'] = tag

        sensor_list = SensorTag.objects.filter(**filter_dict)
        print(sensor_list)
        if sensor_list is not None:
            result = sensor_list
        else:
            result = "No results found"
        return render(request, 'map.html', {'result': result})

def load_main(request):
    if request.method == 'GET':
        return render(request, 'main.html', {})
    elif request.method == 'POST':
        # Get POST data
        timestamp = request.POST.get('timestamp')
        tag_id= request.POST.get('id')
        altitude = request.POST.get('altitude')
        var_long = request.POST.get('long')
        sensor1 = request.POST.get('sensor1')
        sensor2 = request.POST.get('sensor2')
        sensor3 = request.POST.get('sensor3')
        sensor4 = request.POST.get('sensor4')
        tag = request.POST.get('tag')
        lat = request.POST.get('lat')

        filter_dict = {}

        # Get only _id and tag
        if tag_id != "":
            filter_dict['tag_id'] = tag_id
        if tag != "":
            filter_dict['tag'] = tag

        sensor_list = SensorTag.objects.filter(**filter_dict)
        print(sensor_list)
        if sensor_list is not None:
            result = sensor_list
        else:
            result = "No results found"
        return render(request, 'main.html', {'result': result})
