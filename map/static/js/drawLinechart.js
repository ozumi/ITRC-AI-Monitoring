/**
 * Created by juyoung on 2018-05-11.
 */


function chartManager(container){
    this.container = container;
    this.BIRD_ID = "";
    this.PARSE_DATA = null;
    this.SVG= "";

    this.init = function(){
        console.log("draw line chart " + this.container);
        var parentDiv = document.getElementById(this.container);
        var width = parentDiv.clientWidth;
        var height = parentDiv.clientHeight;
        var id = this.container + "_svg";
        chartManager.SVG = id;

        var svg = d3.select(parentDiv)
            .append("svg:svg")
            .attr("id",id)
            .attr("width",700)
            .attr("height",400);

        queue()
        .defer(d3.csv, "../static/data/sp500.csv", this.type)
        .await(this.ready);

        chartManager.PARSE_DATA = d3.timeParse("%b %Y");
    },

    this.ready = function(error, data) {

        if (error) throw error;
        var svg = d3.select("#"+chartManager.SVG),
            margin = {top: 30, right: 20, bottom: 150, left: 40},
            margin2 = {top: 320, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        var x = d3.scaleTime().range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.price); });

        var line2 = d3.line()
            .x(function(d) { return x2(d.date); })
            .y(function(d) { return y2(d.price); });

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        var leftHandle = 0,
            rightHandle = 1140;

        var currentExtent = [0,0];

        var brush = d3.brushX()
            .extent([[leftHandle, 0], [rightHandle, height2]])
            .on("brush start", updateCurrentExtent)
            .on("brush end", brushed);

        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.price; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

        focus.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        focus.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis);

        context.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line2);

        context.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

        context.append("g")
          .attr("class", "brush")
          .on("click", brushed)
          .call(brush)
          .call(brush.move, [new Date(2000,0,1),new Date(2001,0,1)].map(x));

        svg.append("rect")
          .attr("class", "zoom")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          //.call(zoom);

        function updateCurrentExtent() {
            currentExtent = d3.brushSelection(this);
        }

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection;

            //console.log(x(new Date(2001,0,1))); // 1 year in terms of x

            var p = currentExtent,
              xYear = x2(new Date(2001,0,1)),
              left,
              right;

            if (d3.event.selection && s[1] - s[0] >= xYear) {
            if (p[0] == s[0] && p[1] < s[1]) { // case where right handle is extended
              if (s[1] >= width) {
                left = width - xYear
                right = width
                s = [left, right];
              }
              else {
                left = s[1] - xYear/2
                right = s[1] + xYear/2
                s = [left, right];
              }
            }
            else if (p[1] == s[1] && p[0] > s[0]) { // case where left handle is extended
              if (s[0] <= 0) {
                s = [0, xYear];
              }
              else {
                s = [s[0] - xYear/2, s[0] + xYear/2]
              }
            }
            }

            if (!d3.event.selection){ // if no selection took place and the brush was just clicked
                var mouse = d3.mouse(this)[0];
                if (mouse < xYear/2) {
                      s = [0,xYear];
                } else if (mouse + xYear/2 > width) {
                      s = [width-xYear, width];
                } else {
                    s = [d3.mouse(this)[0]-xYear/2, d3.mouse(this)[0]+xYear/2];
                }
            }

            x.domain(s.map(x2.invert, x2));
            focus.select(".line").attr("d", line);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                                                     .scale(width / (s[1] - s[0]))
                                                     .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".line").attr("d", line);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }
    },

    this.type= function(d) {
      d.date = chartManager.PARSE_DATA(d.date);
      d.price = +d.price;
      return d;
    }
}

// var chartManager = {
//     BIRD_ID : "",
//     PARSE_DATA : null,
//     SVG: "",
//
//     init : function(container){
//         console.log("draw line chart");
//         var parentDiv = document.getElementById(container);
//         var width = parentDiv.clientWidth;
//         var height = parentDiv.clientHeight;
//         var id = container + "_svg";
//         chartManager.SVG = id;
//
//         var svg = d3.select(parentDiv)
//             .append("svg:svg")
//             .attr("id",id)
//             .attr("width",700)
//             .attr("height",400);
//         queue()
//         .defer(d3.csv, "../static/data/sp500.csv", chartManager.type)
//         .await(chartManager.ready);
//
//         chartManager.PARSE_DATA = d3.timeParse("%b %Y");
//
//     },
//
//     ready : function(error, data) {
//
//         if (error) throw error;
//         var svg = d3.select("#"+chartManager.SVG),
//             margin = {top: 30, right: 20, bottom: 150, left: 40},
//             margin2 = {top: 320, right: 20, bottom: 30, left: 40},
//             width = +svg.attr("width") - margin.left - margin.right,
//             height = +svg.attr("height") - margin.top - margin.bottom,
//             height2 = +svg.attr("height") - margin2.top - margin2.bottom;
//
//         var x = d3.scaleTime().range([0, width]),
//             x2 = d3.scaleTime().range([0, width]),
//             y = d3.scaleLinear().range([height, 0]),
//             y2 = d3.scaleLinear().range([height2, 0]);
//
//         var xAxis = d3.axisBottom(x),
//             xAxis2 = d3.axisBottom(x2),
//             yAxis = d3.axisLeft(y);
//
//         var line = d3.line()
//             .x(function(d) { return x(d.date); })
//             .y(function(d) { return y(d.price); });
//
//         var line2 = d3.line()
//             .x(function(d) { return x2(d.date); })
//             .y(function(d) { return y2(d.price); });
//
//         svg.append("defs").append("clipPath")
//             .attr("id", "clip")
//             .append("rect")
//             .attr("width", width)
//             .attr("height", height);
//
//         var focus = svg.append("g")
//             .attr("class", "focus")
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         var context = svg.append("g")
//             .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
//
//         var leftHandle = 0,
//             rightHandle = 1140;
//
//         var currentExtent = [0,0];
//
//         var brush = d3.brushX()
//             .extent([[leftHandle, 0], [rightHandle, height2]])
//             .on("brush start", updateCurrentExtent)
//             .on("brush end", brushed);
//
//         var zoom = d3.zoom()
//             .scaleExtent([1, Infinity])
//             .translateExtent([[0, 0], [width, height]])
//             .extent([[0, 0], [width, height]])
//             .on("zoom", zoomed);
//
//         x.domain(d3.extent(data, function(d) { return d.date; }));
//         y.domain([0, d3.max(data, function(d) { return d.price; })]);
//         x2.domain(x.domain());
//         y2.domain(y.domain());
//
//         focus.append("path")
//           .datum(data)
//           .attr("class", "line")
//           .attr("d", line);
//
//         focus.append("g")
//           .attr("class", "axis axis--x")
//           .attr("transform", "translate(0," + height + ")")
//           .call(xAxis);
//
//         focus.append("g")
//           .attr("class", "axis axis--y")
//           .call(yAxis);
//
//         context.append("path")
//           .datum(data)
//           .attr("class", "line")
//           .attr("d", line2);
//
//         context.append("g")
//           .attr("class", "axis axis--x")
//           .attr("transform", "translate(0," + height2 + ")")
//           .call(xAxis2);
//
//         context.append("g")
//           .attr("class", "brush")
//           .on("click", brushed)
//           .call(brush)
//           .call(brush.move, [new Date(2000,0,1),new Date(2001,0,1)].map(x));
//
//         svg.append("rect")
//           .attr("class", "zoom")
//           .attr("width", width)
//           .attr("height", height)
//           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//           //.call(zoom);
//
//         function updateCurrentExtent() {
//             currentExtent = d3.brushSelection(this);
//         }
//
//         function brushed() {
//             if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
//             var s = d3.event.selection;
//
//             //console.log(x(new Date(2001,0,1))); // 1 year in terms of x
//
//             var p = currentExtent,
//               xYear = x2(new Date(2001,0,1)),
//               left,
//               right;
//
//             if (d3.event.selection && s[1] - s[0] >= xYear) {
//             if (p[0] == s[0] && p[1] < s[1]) { // case where right handle is extended
//               if (s[1] >= width) {
//                 left = width - xYear
//                 right = width
//                 s = [left, right];
//               }
//               else {
//                 left = s[1] - xYear/2
//                 right = s[1] + xYear/2
//                 s = [left, right];
//               }
//             }
//             else if (p[1] == s[1] && p[0] > s[0]) { // case where left handle is extended
//               if (s[0] <= 0) {
//                 s = [0, xYear];
//               }
//               else {
//                 s = [s[0] - xYear/2, s[0] + xYear/2]
//               }
//             }
//             }
//
//             if (!d3.event.selection){ // if no selection took place and the brush was just clicked
//                 var mouse = d3.mouse(this)[0];
//                 if (mouse < xYear/2) {
//                       s = [0,xYear];
//                 } else if (mouse + xYear/2 > width) {
//                       s = [width-xYear, width];
//                 } else {
//                     s = [d3.mouse(this)[0]-xYear/2, d3.mouse(this)[0]+xYear/2];
//                 }
//             }
//
//             x.domain(s.map(x2.invert, x2));
//             focus.select(".line").attr("d", line);
//             focus.select(".axis--x").call(xAxis);
//             svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
//                                                      .scale(width / (s[1] - s[0]))
//                                                      .translate(-s[0], 0));
//         }
//
//         function zoomed() {
//             if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
//             var t = d3.event.transform;
//             x.domain(t.rescaleX(x2).domain());
//             focus.select(".line").attr("d", line);
//             focus.select(".axis--x").call(xAxis);
//             context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
//         }
//     },
//
//     type: function(d) {
//       d.date = chartManager.PARSE_DATA(d.date);
//       d.price = +d.price;
//       return d;
//     }
// }
