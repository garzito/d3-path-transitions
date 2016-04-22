import d3 from 'd3';

require('!style!css!sass!./styles/main.scss');

var duration   = 100,
    n          = 250,
    count      = 0,
    now        = new Date(Date.now() - duration),
    scrollData = d3.range(n).map(function() { return 0; }),
    
    margin     = {top: 6, right: 0, bottom: 20, left: 40},
    width      = 960 - margin.right,
    height     = 200 - margin.top - margin.bottom,

// X axis
    x          = d3.time.scale()
                    .domain([now - (n - 2) * duration, now - duration])
                    .range([0, width]),

// Y axis
    y          = d3.scale.linear()
                    .range([height, 0]),

// The line drawing function
    line       = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
                    .y(function(d, i) { return y(d); }),

// SVG
    svg        = d3.select(".graph").append("p").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .style("margin-left", -margin.left + "px")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var axis       = svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(x.axis = d3.svg.axis().scale(x).orient("bottom")),

        path       = svg.append("g")
                        .attr("clip-path", "url(#clip)")
                        .append("path")
                        .datum(scrollData)
                        .attr("class", "line"),

// Transition animation
transition = d3.select({}).transition()
                .duration(100)
                .ease("linear");

// Scroll event handler
d3.select(window).on("scroll", function() { ++count; });

// Redrawing function
function tick() {
  transition = transition.each(function() {

    // Update x and y domains
    now = new Date();
    x.domain([now - (n - 2) * duration, now - duration]);
    y.domain([0, d3.max(scrollData)]);

    // Push the accumulated count onto the back of array, and reset the counter
    scrollData.push(Math.min(30, count));
    count = 0;

    // Redraw the line
    svg.select(".line")
        .attr("d", line)
        .attr("transform", null);

    // Slide the X axis left
    axis.call(x.axis);

    // Slide the line left
    path.transition()
        .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

    // Pop the old data point off the front of the array
    scrollData.shift();

  }).transition().each("start", tick);
}

// Run
tick();
