/**
 * Created by juyoung on 2018-02-05.
 */

//Fetch some data from a GeoJSON file - choropleth

function returnColor(d, type){
    console.log("returnBlack");
 if (type == "bury") {
        return d > 35 ? '#800026' :
            d > 30 ? '#BD0026' :
                d > 25 ? '#E31A1C' :
                    d > 20 ? '#FC4E2A' :
                        d > 15 ? '#FD8D3C' :
                            d > 10 ? '#FEB24C' :
                                d > 5 ? '#FED976' :
                                    '#FFEDA0';
    }else if (type == "water") {
        return d > 35 ? '#084594' :
            d > 30 ? '#2171b5' :
                d > 25 ? '#4292c6' :
                    d > 20 ? '#6baed6' :
                        d > 15 ? '#9ecae1' :
                            d > 10 ? '#c6dbef' :
                                d > 5 ? '#deebf7' :
                                    '#f7fbff';
    }else if (type == "air") {
        return d > 35 ? '#005a32' :
            d > 30 ? '#238b45' :
                d > 25 ? '#41ab5d' :
                    d > 20 ? '#74c476' :
                        d > 15 ? '#a1d99b' :
                            d > 10 ? '#c7e9c0' :
                                d > 5 ? '#e5f5e0' :
                                    '#f7fcf5';
    }
}

function style(feature) {
    console.log("style");

    var data;
    var type = mapManager.TYPE;

    if (type == "bury")
        data = feature.properties.bury;
    else if (type == "water")
        data = feature.properties.water;
    else if (type == "air")
        data = feature.properties.air;

    return {
        fillColor: returnColor(data, type),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.3
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '1',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    mapManager.CHOROPLETH.resetStyle(e.target);
}

function showInfo(e) {
  //  mapManager.MAP.fitBounds(e.target.getBounds());
    mapManager.CHOROPLETH.openPopup();
}

function onEachFeature(feature, layer) {
    var data, popupContent;
    var type = mapManager.TYPE;

    if (type == "bury"){
        data = feature.properties.bury;
        popupContent = "<strong>" + feature.properties.NAME_1 + "  " + feature.properties.NAME_2 + "</strong><br/>" + data + " burried place"
    }
    else if (type == "water"){
        data = feature.properties.water;
        popupContent = "<strong>" + feature.properties.NAME_1 + "  " + feature.properties.NAME_2 + "</strong><br/>" + "Water condition : " + data

    }
    else if (type == "air"){
        data = feature.properties.air;
        popupContent = "<strong>" + feature.properties.NAME_1 + "  " + feature.properties.NAME_2 + "</strong><br/>" + "Air condition : " + data

    }

    var popupOptions = {maxWidth : 500};
    layer.bindPopup(popupContent, popupOptions);

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: showInfo
    });

}

function onCensusFeature(feature, layer){
    var data, popupContent;
    var type = mapManager.TYPE;

    data = feature.properties.SIGUNGU_NM;
    popupContent = "<strong>" + data + "</strong><br/>" ;

    var popupOptions = {maxWidth : 500};
    layer.bindPopup(popupContent, popupOptions);

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: showInfo
    });
}
function style_census_big(feature) {
    return {
        // fillColor: getColor(data, type),
        weight: 2,
        opacity: 0.7,
        color: '#666',
        dashArray: '1',
        fillOpacity: 0.1
    };
}

function style_census_middle(feature) {
    return {
        // fillColor: getColor(data, type),
        weight: 2,
        opacity: 0.2,
        color: '#666',
        dashArray: '1',
        fillOpacity: 0.1
    };
}


function drawChoropleth() {
    console.log("draw choropleth");

    mapManager.CHOROPLETH = L.geoJson(mapManager.GEO_DATA, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mapManager.MAP);

    // $.getJSON("../static/data/skorea_municipalities_geo_census_middle.geojson", function (json) {
    //     // console.log(json);
    //     // var mapModel = new PandemicMapModel();
    //
    //     mapManager.CHOROPLETH = L.geoJson(json, {
    //         style: style_census_middle,
    //         onEachFeature: onCensusFeature
    //     }).addTo(mapManager.MAP);
    //
    //     console.log("draw SIGUNGU finish");
    // });


    // console.log("data loaded2");
    // $.getJSON("../static/data/skorea_municipalities_geo_census_big.geojson", function (json) {
    //     // console.log(json);
    //     //
    //     mapManager.CHOROPLETH = L.geoJson(json, {
    //         style: style_census_big,
    //         // onEachFeature: onCensusFeature
    //     }).addTo(mapManager.MAP);
    //
    //     console.log("data SIDO finish");
    // });
}



//Init legend
// var log = d3.scaleOrdinal()
//     .domain(["35", "30", "25", "20", "15", "10", "5", "0"])
//     .range(["#800026", "#BD0026", "#E31A1C", "#FC4E2A", "#FD8D3C", "#FEB24C", "#FED976", "#FFEDA0"]);
// showLegend(log);