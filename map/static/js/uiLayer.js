/**
 * Created by juyoung on 2017-11-20.
 */

var color_red = 'red';
var color_blue = 'blue';
var color_green = 'green';

var colors = ['rgb(20, 200, 100)', 'rgb(200, 100, 20)', null, null, 'rgb(20, 200, 100)', 'rgb(0, 0, 0)'];

Object.assign(mapManager, {
    loadToolbar : function (map){

        L.DrawToolbar = L.Toolbar.Control.extend({
            position: 'topleft',
            options: {
                actions: [
                    L.Draw.Polygon,
                    L.Draw.Polyline,
                    L.Draw.Marker,
                    L.Draw.Rectangle,
                    L.Draw.Circle
                ],
                className: 'leaflet-draw-toolbar' // Style the toolbar with Leaflet.draw's custom CSS
            }
        });
        new L.DrawToolbar().addTo(mapManager.MAP);

    },

    removeLayer : function(){
        mapManager.MAP.removeLayer(mapManager.HEAT);
        mapManager.MAP.removeLayer(mapManager.PATH);
    },

    drawHeatmap : function(){
        mapManager.HEAT.addTo(mapManager.MAP);
    },

    drawPath : function(){
        mapManager.PATH.addTo(mapManager.MAP);
    },

    drawMarkers : function(){
        $.getJSON(mapManager.DATA_PATH, function(json) {
            var marker_layer = L.geoJson(json, {
                onEachFeature: function(feature,layer) {
                    layer.bindPopup(feature.properties.time);
                },
                pointToLayer: function(geoJsonPoint,latlng){
                    var mark = new L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: 'twitter', markerColor: 'blue', prefix: 'fa', spin:false})});
                    mapManager.MARKERS.push(mark);
                    return mark;
                }
            });

            // //For a Range-Slider use the range property:
            // var sliderControl = L.control.sliderControl({
            //     position: "topright",
            //     layer: marker_layer,
            //     range: true,
            //     timeAttribute: 'time',
            //     showAllOnStart: true,
            //     alwaysShowDate : true,
            //     rezoom:false
            //     // follow:1
            // });
            //
            // //Make sure to add the slider to the map ;-)
            // mapManager.MAP.addControl(sliderControl);
            // //And initialize the slider
            // sliderControl.startSlider();
        });
    },

    drawImportance : function(){
        var data;
        if (mapManager.DATA_NUM == 1)
            data = importantMarkersOne;
        else if (mapManager.DATA_NUM == 2)
            data = importantMarkersTwo;
        else if (mapManager.DATA_NUM == 3)
            data = importantMarkersThree;

        data.map(function (n,i){
            mapManager.IMPORTANT_MARKS[i] = L.marker(n, {
                highlight: "permanent",
                icon: L.AwesomeMarkers.icon({icon: 'twitter', markerColor: 'yellow', prefix: 'fa', spin:false})
            }).addTo(mapManager.MAP);
        })
    },

    changeData : function (dataNum){
        /* remove all layers */
        mapManager.MARKERS.map(function(m){
            mapManager.MAP.removeLayer(m);
        });
        mapManager.IMPORTANT_MARKS.map(function(m){
            mapManager.MAP.removeLayer(m);
        })
        mapManager.MARKERS = [];
        mapManager.IMPORTANT_MARKS = [];
        mapManager.removeLayer();
        mapManager.HEAT = new HeatmapOverlay(cfg);

        if (dataNum == 1) {
            mapManager.DATA_NUM = 1;
            mapManager.DATA_PATH = "../static/data/points1.json";
            mapManager.PATH = L.curve(pathOne, {color: color_blue, fill: false,
                animate: {duration:3000, easing:"ease-in"}});
            mapManager.HEAT.setData(heatOne);

        }else if (dataNum == 2) {
            mapManager.DATA_NUM = 2;
            mapManager.DATA_PATH = "../static/data/points2.json";
            mapManager.PATH = L.curve(pathTwo, {color: color_red, fill: false,
                animate: {duration:3000, easing:"ease-in"}});
            mapManager.HEAT.setData(heatTwo);
        }else if (dataNum == 3) {
            mapManager.DATA_NUM = 3;
            mapManager.DATA_PATH = "../static/data/points3.json";
            mapManager.PATH = L.curve(pathThree,{color: color_green, fill: false,
                animate: {duration:3000, easing:"ease-in"}});
            mapManager.HEAT.setData(heatThree);
          //  L.marker([38.402244, 127.488785], {icon: L.AwesomeMarkers.icon({icon: 'twitter', markerColor: 'blue', prefix: 'fa', spin:false}) }).addTo(mapManager.MAP);

            // var polyline = L.polycolor(latLngs, {
            //     colors: colors,
            //     weight: 5
            // }).addTo(mapManager.MAP);

            //smooth factor does not work
            // var polyline = new L.Polyline(pathFourth, {
            //     time: "2013-01-22 10:24:59+01",
            //     color: 'red',
            //     weight: 1,
            //     opacity: 1,
            //     smoothFactor: 200
            // });
            //
            // polyline.addTo(mapManager.MAP);
        }

        if ($('#marker').is(':checked'))
            mapManager.drawMarkers();
        if ($('#path').is(':checked'))
            mapManager.drawPath();
        if ($('#heatmap').is(':checked'))
            mapManager.drawHeatmap();
        if ($('#important').is(':checked'))
            mapManager.drawImportance();
    }
});