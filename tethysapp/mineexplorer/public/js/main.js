require(["esri/map", "dojo/domReady!"], function(Map) {
  var map = new Map("map", {
    center: [-112, 43.5],
    zoom: 8,
    basemap: "topo"
  });
});