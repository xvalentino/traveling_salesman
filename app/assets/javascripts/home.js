$(document).ready(function() {
  var width = 960,
  height = 570;

  var places = {
    BAR: [41.3, 2],
    BER: [52.5, 13.3],
    BRU: [50.8, 4.3],
    DUB: [53.3, 6.2],
    HAM: [53.5, 10.0],
    KIE: [50.4, 30.5],
    LON: [51.5, 0.1],
    MAD: [40.4, 3.7],
    MIL: [45.5, 9.2],
    MOS: [55.8, 37.6],
    MUN: [48.1, 11.6],
    PAR: [48.9, 2.4],
    ROM: [41.9, 12.5],
    VIE: [48.2, 16.4],
    WAR: [52.2, 21]
  };

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

  svg.append("path")
    .datum(route)
    .attr("class", "route")
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

  d3.json("/assets/world-50m.json", function(error, world) {
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
});
