var birdFileName="../static/data/";
var heatData = {max :10,data:[]};
var pathData = {max :10,data:[]};

function drawBirds(){
    console.log("draw Birds start");


    $('#bird1').on('click', function() {

        startDrawingInfo(birdFileName+"bird1.json");
        /*highlight selected menu item*/
        $('.world').removeClass('active');
        this.classList.add("active");

        // $.getJSON("../static/data/bird1.json", function (json) {
        //     console.log("bird1");
        //
        //     for (var i = 0; i < json.length - 1; i++) {
        //         // console.log(json[i].lat +" ," +json[i].long);
        //         L.polyline([[json[i].lat, json[i].long], [json[i + 1].lat, json[i + 1].long]],
        //             {color: getColor(json[i].altitude)}).addTo(mapManager.MAP)
        //
        //         heatData.data.push({lat:json[i].lat, lng:json[i].long, count:json[i].sensor3})
        //     }
        //     mapManager.HEAT.setData(heatData);
        //     mapManager.drawHeatmap();
        //     L.circleMarker([json[json.length - 1].lat, json[json.length - 1].long], {radius: 5}).addTo(mapManager.MAP);
        // });
    });

    $('#bird2').on('click', function() {

        startDrawingInfo(birdFileName+"bird2.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });

    $('#bird3').on('click', function() {

        startDrawingInfo(birdFileName+"bird3.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });

    $('#bird4').on('click', function() {

        startDrawingInfo(birdFileName+"bird4.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });
    $('#bird5').on('click', function() {

        startDrawingInfo(birdFileName+"bird5.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });

    $('#bird6').on('click', function() {

        startDrawingInfo(birdFileName+"bird6.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });

    $('#bird7').on('click', function() {

        startDrawingInfo(birdFileName+"bird7.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });
    $('#bird8').on('click', function() {

        startDrawingInfo(birdFileName+"bird8.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });

    $('#bird9').on('click', function() {

        startDrawingInfo(birdFileName+"bird9.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });

    $('#bird10').on('click', function() {

        startDrawingInfo(birdFileName+"bird10.json");
        $('.world').removeClass('active');
        this.classList.add("active");
    });
    console.log("draw Birds end");
}

drawBirds();

// Leaflet.MultiOptionsPolyline     -> https://github.com/hgoebl/Leaflet.MultiOptionsPolyline
// Leaflet.hotline                  -> https://github.com/iosphere/Leaflet.hotline/

//기존 leaflet 사용
// var yourGeoJSON = [
//     { "type": "Feature", "properties": { "id": 2, "elevation": 50 }, "geometry": { "type": "LineString", "coordinates": [ [ 11.836395263671875, 47.75317468890147 ], [ 11.865234375, 47.73193447949174 ] ] } },
//     { "type": "Feature", "properties": { "id": 1, "elevation": 750 }, "geometry": { "type": "LineString", "coordinates": [ [ 11.865234375,47.73193447949174 ], [ 11.881027221679688, 47.700520033704954 ] ] } },
//     { "type": "Feature", "properties": { "id": 0, "elevation": 1700 }, "geometry": { "type": "LineString", "coordinates": [ [ 11.881027221679688, 47.700520033704954 ], [ 11.923599243164062, 47.706527200903395 ] ] } },
//     { "type": "Feature", "properties": { "id": 0, "elevation": 3000 }, "geometry": { "type": "LineString", "coordinates": [ [ 11.923599243164062, 47.706527200903395 ], [ 11.881027221679688, 47.700520033704954 ], ] } }
// ];
//
// L.geoJson(yourGeoJSON, {
//     style: function (feature) {
//         return {
//             "color": getColor(feature.properties.elevation),
//             "opacity": 1,
//         }}
// }).addTo(map);
//
function getColor(x) {
    return x < 50     ?    '#ffffb2':
        x < 100    ?   '#fecc5c':
            x < 150     ?   '#fd8d3c':
                x < 200    ?   '#f03b20':
                    '#bd0026';
};
