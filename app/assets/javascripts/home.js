$(document).ready(function() {
  var width = 960,
  height = 570;

  var format_coordinates = function (coordinates) {
    x = coordinates[0]
    y = coordinates[1]
    return [y, x];
  }

  updateRoutes = function (routes) {
    d3.select(".route").remove();

    svg.append("path")
      .datum(routes)
      .attr("class", "route")
      .attr("d", path);
  }

  var places = {
    BAR: format_coordinates([41.3, 2]),
    BER: format_coordinates([52.5, 13.3]),
    BRU: format_coordinates([50.8, 4.3]),
    DUB: format_coordinates([53.3, 6.2]),
    HAM: format_coordinates([53.5, 10.0]),
    KIE: format_coordinates([50.4, 30.5]),
    LON: format_coordinates([51.5, 0.1]),
    MAD: format_coordinates([40.4, 3.7]),
    MIL: format_coordinates([45.5, 9.2]),
    MOS: format_coordinates([55.8, 37.6]),
    MUN: format_coordinates([48.1, 11.6]),
    PAR: format_coordinates([48.9, 2.4]),
    ROM: format_coordinates([41.9, 12.5]),
    VIE: format_coordinates([48.2, 16.4]),
    WAR: format_coordinates([52.2, 21])
  };

  var placesArray = [
    places.BAR,
    places.BER,
    places.BRU,
    places.DUB,
    places.HAM,
    places.KIE,
    places.LON,
    places.MAD,
    places.MIL,
    places.MOS,
    places.MUN,
    places.PAR,
    places.ROM,
    places.VIE,
    places.WAR
  ]

  var route = {
    type: "LineString",
    coordinates: [
      places.BAR,
      places.BER,
      places.BRU,
      places.DUB,
      places.HAM,
      places.KIE,
      places.LON,
      places.MAD,
      places.MIL,
      places.MOS,
      places.MUN,
      places.PAR,
      places.ROM,
      places.VIE,
      places.WAR
    ]
  };

  var projection = d3.geo.mercator()
    .scale((width + 1) / .5 / Math.PI)
    .translate([width / 2.3, height / .65])
    .precision(.1)
    .center([5, 0]);

  var path = d3.geo.path()
    .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

  svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

  svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  var point = svg.append("g")
    .attr("class", "points")
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + projection(d.value) + ")"; });

  point.append("circle")
    .attr("r", 4.5);

  point.append("text")
    .attr("y", 10)
    .attr("dy", ".71em")
    .text(function(d) { return d.key; });

  d3.json("/assets/world-110m2.json", function(error, world) {
    svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");


  $("#start").on('click', function() {
    var gen = $("#gen").val();
    var pop = $("#pop").val();
    var mutation = $("#mutation").val();

    source = new EventSource('/feed?' + "gen=" + gen + "&pop=" + pop + "&mutation=" + mutation);
    source.onmessage = function (event){
      if (event.data === '"stream_end"') { 
        source.close(); 
        return
      };
      var response = JSON.parse(event.data);
      var route = response.route
      var fitness = response.fitness

      $("#fitness").text("Cost: $" + fitness)

      var routesPlaces = route.map(function(index) {
        return placesArray[index];
      })

      var routes = {
        type: "LineString",
        coordinates: routesPlaces
      };


      updateRoutes(routes);
    }
  });

});
