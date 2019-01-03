/**
 * Created by juyoung on 2017-11-20.
 */
/**
 * Created by skyjin on 2017-07-19.
 */
var mapManager = {
    MAP: null,
    ROUTE_L: null,
    TARGET: null,
    ROADS: [],
    INIT_C:0,
    MAX_BOUNDS: [[35.228794142471024, 128.58123779296878], [35.76991491635478, 129.82131958007815]],
    BOUNDS: [[35.50651802802079, 129.23681259155276], [35.57412411048198, 129.39182281494143]],
    TYPE : "bury",
    IMPORTANT_MARKS : [],
    MARKERS : [],
    DATA_NUM : 1,
    DATA_PATH : "",
    GEO_DATA : null,

    init: function (container) {
        // $("#map").width(container.width).height(container.height);
        console.log("map is initialized");
        //   d3.queue()
        //       .defer(d3.csv, "static/data/cctv.csv")
        //       .defer(d3.json, "static/data/dot.json")
        //       .await(function (error, cctvData, vdsData) {
        var northEast = [50.788522, 150.679672];
        var southWest = [10.364052, 110.237717];
        //
        // var map = L.map('map', {
        //     center: [36.53, 127.02],
        //     zoom: 4,
        //     // maxBounds: [northEast, southWest],
        //     attributionControl: false
        // });
        //
        // // map.setMaxBounds(mapManager.MAX_BOUNDS);
        // // map.fitBounds(mapManager.BOUNDS);
        //
        // // create layer groups of snapshot to increase search performance
        // mapManager.MAP = map;

        /* make dot pins */
        var loadIcon = L.Icon.extend({
            options: {
                iconUrl: 'static/images/pinMarker.png',
                iconSize: [20, 26]
            }
        });

        // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 18,
        //     attribution: 'Map data &copy; OpenStreetMap contributors'
        // }).addTo(map);

        // var OSMLayer = L.tileLayer('http://ivaderlab.unist.ac.kr:8085/styles/osm-bright/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        // }); // OSM Baselayer
        // //  var heat = L.heatLayer(TOTALPoints, {radius: 12, blur: 25, maxZoom: 11});
        // // mapManager.VDS = vdsLayer;
        // mapManager.OSM = OSMLayer;
        // OSMLayer.addTo(mapManager.MAP);

        var pathLayer = L.curve(pathOne, {color: color_blue, fill: false,
            animate: {duration:3000, easing:"ease-in"}});
        pathLayer.addTo(mapManager.MAP);
        mapManager.PATH = pathLayer;

        var heatmapLayer = new HeatmapOverlay(cfg);
        // addressPoints = addressPoints.map(function (p) { return [p[0], p[1]]; });
        mapManager.HEAT = heatmapLayer;
        heatmapLayer.setData(heatOne);
        heatmapLayer.addTo(mapManager.MAP);

        var overlayMaps = {
//                    "<img src='static/images/vdsMarker.png' width='15' height='19'> ": vdsLayer,
        };
        var layerControl = L.control.layers(null, overlayMaps, {collapsed: false});

        //  mapManager.loadToolbar(mapManager.MAP);
        mapManager.MAP.addControl(layerControl);

        // add route search interaction using drag
        mapManager.SELECTION = [];
        var counter = 0;
        var prevBounds = null;

        if ($('.leaflet-zoom-box-control').hasClass('active'))
            prevBounds = map.getBounds();
        //  });

        //Fetch some data from a GeoJSON file - mark
        $.getJSON("../static/data/points1.json", function(json) {
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
            //
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

        /*geo data load*/
        $.getJSON("../static/data/skorea-municipalities-geo.json", function (json) {
            mapManager.GEO_DATA = json;
            console.log("geo-data loaded");

            drawChoropleth();
        });

        $('#path').on('click', function(){
            console.log("draw path");
            if($(this).is(":checked")) {
                mapManager.drawPath();
            }
            else {
                mapManager.MAP.removeLayer(mapManager.PATH)
            }
        })

        $('#path-check').prop('checked', true);

        $('#heatmap').on('click', function(){
            console.log("draw heatmap");
            if($(this).is(":checked")) {
                mapManager.drawHeatmap();
            }
            else {
                mapManager.MAP.removeLayer(mapManager.HEAT)
            }
        });

        $('#heat-check').prop('checked', true);

        $('#marker').on('click', function(){
            console.log("draw mark");
            if($(this).is(":checked")) {
                mapManager.drawMarkers();
            }
            else {
                mapManager.MARKERS.map(function (layer) {
                    mapManager.MAP.removeLayer(layer)
                })
            }
        });

        $('#marker-check').prop('checked', true);

        $('#important').on('click', function(){
            console.log("show important marks");
            if($(this).is(":checked")) {
                mapManager.drawImportance();
            }
            else {
                mapManager.IMPORTANT_MARKS.map(function(m){
                    mapManager.MAP.removeLayer(m);
                })
            }
        });

        $('#important-check').prop('checked', false);

        $('#kbird1').on('click', function(){
            $('.korea').removeClass('active');
            this.classList.add("active");
            mapManager.changeData(1);
        });

        $('#kbird2').on('click', function(){
            $('.korea').removeClass('active');
            this.classList.add("active");
            mapManager.changeData(2);
        });

        $('#kbird3').on('click', function(){
            $('.korea').removeClass('active');
            this.classList.add("active");
            mapManager.changeData(3);
        });
        $('#bury').on('click', function(){

            $('.choro').removeClass('active');
            this.classList.add("active");

            mapManager.MAP.removeLayer(mapManager.CHOROPLETH);
            mapManager.TYPE = "bury";
            drawChoropleth();

            // Change legend
            var log = d3.scaleOrdinal()
                .domain(["35", "30", "25", "20", "15", "10", "5", "0"])
                .range(["#800026", "#BD0026", "#E31A1C", "#FC4E2A", "#FD8D3C", "#FEB24C", "#FED976", "#FFEDA0"]);
           // showLegend(log);

        });

        $('#water').on('click', function(){
            $('.choro').removeClass('active');
            this.classList.add("active");
            mapManager.MAP.removeLayer(mapManager.CHOROPLETH);
            mapManager.TYPE = "water";
            drawChoropleth();

            // Chagne legend
            var log = d3.scaleOrdinal()
                .domain(["35", "30", "25", "20", "15", "10", "5", "0"])
                .range(["#084594", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7", "#f7fbff"]);
            //showLegend(log);
        });

        $('#air').on('click', function(){
            $('.choro').removeClass('active');
            this.classList.add("active");
            mapManager.MAP.removeLayer(mapManager.CHOROPLETH);
            mapManager.TYPE = "air";
            drawChoropleth();

            // Chagne legend
            var log = d3.scaleOrdinal()
                .domain(["35", "30", "25", "20", "15", "10", "5", "0"])
                .range(["#005a32", "#238b45", "#41ab5d", "#74c476", "#a1d99b", "#c7e9c0", "#e5f5e0", "#f7fcf5"]);
            //showLegend(log);
        });
    }
};