var margin = {top: 30, right: 50, bottom: 30, left: 50, width:100 , height: 60};

var infos = ["sensor1", "sensor2", "sensor3", "sensor4"];
var data=[];
var svgs=[];
var allData;
var timer;
var trajectoryIndex;
var currentMarker = null;
var preState_path = false;
initChart();


// https://keithpblog.org/post/upgrading-d3-from-v3-to-v4/
function drawChart(target, data, info, opt){
    svg = d3.select(target)
        .append("svg")
        .attr("width",opt.width  + opt.margin.width)
        .attr("height",opt.height + opt.margin.height)
        .attr("class","chart-container");

    var main = svg.append("g")
        .attr("width",opt.width)
        .attr("height",opt.height)
        .attr("transform", "translate(" + opt.margin.left + "," + opt.margin.top + ")");

    // .attr("transform", "translate(" +0+","+ opt.height+")");

    if(opt.title!=""){
        svg.append("text").text(opt.title)
            .attr("class","chart-title")
            .attr("dx","1em")
            .attr("dy","1.25em");
    }

    // 시간의 폭, 서버 정보의 범위 가져오기
    var xExtent = d3.extent(data,function(d){ return new Date(d.timestamp);});
    var yExtent = d3.extent(data, function(d){return +d[info]});

    // x축, y축, 색의 스케일 작성
    var x = d3.scaleTime().range([0, opt.width]).domain(xExtent);
    var y = d3.scaleLinear().range([opt.height, 0]).domain([0, yExtent[1]]);
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // 선분의 path 요소의 d속성값을 계산한다
    var line = d3.line()
        .x(function(d){ return x(new Date(d.timestamp))})
        .y(function(d){ return y(+d[info])});

    // // // path 속성을 추가해서 그린다
    var path = main.append("path").data([data])
        .attr("class","line")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke",color(0));

    // console.log("h");

    // // 축을 작성
    var xaxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%d")).ticks(6);
    var yaxis = d3.axisLeft(y).tickFormat(d3.format('s')).ticks(4);

    var xAxis = main.append("g").call(xaxis)
        .attr("class", "axis")
        .attr("transform", "translate(" +0+","+ opt.height+")");
    var yAxis = main.append("g").call(yaxis).attr("class", 'axis');

    svg.update = function(){
        if(data.length < 2){
            return ;
        }else if(!svg.classed('brushing')){
            // drawInfo.js:77 2009-05-27 14:54:07
            // drawInfo.js:78 Wed May 27 2009 14:54:07 GMT+0900 (대한민국 표준시)
            xExtent = d3.extent(data,function(d){ return  new Date(d.timestamp);});
            yExtent = d3.extent(data, function(d){ return +d[info]});

            x.domain(xExtent);
            y.domain([0,yExtent[1]]);

            // brush.extent(xExtent);

            path.transition().attr('d',line);

            xAxis.call(xaxis);
            yAxis.call(yaxis);
        }
    }

    return svg;
}

function initChart(){
    data=[];
    svgs=[];

    if($('#path').is(':checked')){
        preState_path = true;
    }

    for(var idx = 0; idx< infos.length; idx++){
        svgs.push(drawChart(document.getElementById("graphContainer"), data, infos[idx], {
            width: document.getElementById("graphContainer").clientWidth ,
            height: 100,
            margin: margin,
            title: infos[idx]
        }));
    }
}

function stopDrawingInfo(){
    d3.selectAll('.chart-container').remove();

    mapManager.MAP.removeLayer(mapManager.HEAT);
    if(currentMarker)
        mapManager.MAP.removeLayer(currentMarker);

    if(pathData.data.length != 0 )
        pathData.data.forEach(function(pth){mapManager.MAP.removeLayer(pth);} );
        // mapManager.MAP.removeLayer(pathData.data.shift());


    heatData = {max :10,data:[]};
    pathData = {max :10,data:[]};
}

function startDrawingInfo(fileName){
    stopDrawingInfo();
    initChart();
    trajectoryIndex = 0;

    clearInterval(timer);
    console.log("startDrawingChart");

    $.ajax({
      dataType: "json",
      url: fileName,
      data: allData,
      async: false,
      success: function(allData) {

        timer= setInterval(function(){
          if(allData.length == 0){
              return clearInterval(timer);
          }else{
              if(currentMarker) {
                  mapManager.MAP.removeLayer(currentMarker);

                  if(pathData.data.length != 0) {
                      pathData.data[pathData.data.length - 1].setStyle({opacity: .6, dashArray: '15,10',});
                      pathData.data[pathData.data.length - 1].redraw();
                  }
              }

              pathData.data.push(L.polyline([[allData[trajectoryIndex].lat, allData[trajectoryIndex].long],
                          [allData[trajectoryIndex + 1].lat, allData[trajectoryIndex + 1].long]],
                      {color: getColor(allData[trajectoryIndex].altitude)}));

              if($('#path').is(":checked")) {
                  // currentLine
                  if(preState_path){
                      pathData.data[pathData.data.length -1 ].addTo(mapManager.MAP);
                  }else{
                      pathData.data.forEach(function(pth){pth.addTo(mapManager.MAP);});
                  }

                  preState_path = true;
              }else{
                  if(pathData.data.length != 0 )
                    pathData.data.forEach(function(pth){mapManager.MAP.removeLayer(pth);} );

                  preState_path = false;
              }

              if($('#heatmap').is(":checked")) {
                  heatData.data.push({
                      lat: allData[trajectoryIndex].lat, lng: allData[trajectoryIndex].long,
                      count: allData[trajectoryIndex].sensor3
                  })
                  mapManager.HEAT.setData(heatData);
                  mapManager.drawHeatmap();
              }

              if($('#marker').is(":checked")) {
                  currentMarker = L.circleMarker([allData[trajectoryIndex + 1].lat, allData[trajectoryIndex + 1].long],
                      {radius: 5}).addTo(mapManager.MAP);
              }

              data.push(allData.shift());

              for(var i=0; i< svgs.length;i++){
                 svgs[i].update();
              }
          }
        },1000);
      }
    });
}


// add
// function resize() {
//     var width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
//         height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;
//
//     // Update the range of the scale with new width/height
//     xScale.range([0, width]);
//     yScale.range([height, 0]);
//
//     // Update the axis and text with the new scale
//     svg.select('.x.axis')
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);
//
//     svg.select('.y.axis')
//         .call(yAxis);
//
//     // Force D3 to recalculate and update the line
//     svg.selectAll('.line')
//         .attr("d", function(d) { return line(d.datapoints); });
//
//     // Update the tick marks
//     xAxis.ticks(Math.max(width/75, 2));
//     yAxis.ticks(Math.max(height/50, 2));
//
// };
