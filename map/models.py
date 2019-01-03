from django.db import models

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
class SensorTag(models.Model):
    tag_id = models.IntegerField()
    timestamp = models.DateTimeField()
    altitude = models.FloatField(null=True)
    var_long = models.FloatField(null=True)
    sensor1 = models.IntegerField()
    sensor2 = models.IntegerField()
    sensor3 = models.IntegerField()
    sensor4 = models.IntegerField()
    tag = models.IntegerField()
    lat = models.FloatField(null=True)

