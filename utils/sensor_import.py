from map.models import SensorTag
import json


def data_migration():
    """
    {
        "timestamp": "2009-08-15 11:19:26.000",
        "altitude": "0.0",
        "long": "8.354",
        "sensor4": "0",
        "sensor1": "8",
        "tag": "91733",
        "lat": "54.126999999999995",
        "sensor3": "152",
        "sensor2": "21",
        "id": "1079398592"
    }
    """
    json_file = open('./utils/A_all', 'r')
    lines = json_file.readlines()
    for line in lines:
        line_json = json.loads(line)
        tag_id = line_json.get('id')
        timestamp = line_json.get('timestamp')
        altitude = line_json.get('altitude')
        var_long = line_json.get('long')
        sensor1 = line_json.get('sensor1')
        sensor2 = line_json.get('sensor2')
        sensor3 = line_json.get('sensor3')
        sensor4 = line_json.get('sensor4')
        tag = line_json.get('tag')
        lat = line_json.get('lat')

        new_tag = SensorTag.objects.create(
            tag_id = tag_id,
            timestamp = timestamp,
            sensor1 = sensor1,
            sensor2 = sensor2,
            sensor3 = sensor3,
            sensor4 = sensor4,
            tag = tag
        )

        if lat != '':
            new_tag.lat = lat
        if var_long != '':
            new_tag.var_long = var_long
        if altitude != '':
            new_tag.altitude= altitude

        new_tag.save()
        


