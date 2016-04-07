var map, toolbar, symbol, geomTask,app;

      require([
        "esri/map",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "dojo/parser", "dijit/registry",
        "esri/graphicsUtils",
        "esri/tasks/Geoprocessor",
        "esri/tasks/FeatureSet",
        "esri/tasks/LinearUnit",
        "dijit/form/Button", "esri/request","dijit/WidgetSet", "dojo/domReady!"

      ], function(
        Map, Draw, Graphic,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
        parser, registry,graphicsUtils,Geoprocessor,FeatureSet,LinearUnit,Button,esriRequest
      ) {
        parser.parse();
        var featureSet = new FeatureSet();

        map = new Map("map", {
          basemap: "streets",
          center: [-112.5, 43.5],
          zoom: 8
        });

        map.on("load", createToolbar);
         $("#calc").on("click", run_service);

        // loop through all dijits, connect onClick event
        // listeners for buttons to activate drawing tools
        registry.forEach(function(d) {
          // d is a reference to a dijit
          // could be a layout container or a button
          if ( d.declaredClass === "dijit.form.Button" ) {
            d.on("click", activateTool);
          }
        });

        function activateTool() {
            map.graphics.clear();
          var tool = this.label.toUpperCase().replace(/ /g, "_");
          toolbar.activate(Draw[tool]);
          map.hideZoomSlider();
        }

        function createToolbar(themap) {
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }
        var gp = new Geoprocessor("http://geoserver.byu.edu/arcgis/rest/services/MineExplorer/MiningExplorer/GPServer/MiningExplorer");
            gp.setOutputSpatialReference({
              wkid: 102100
            });
        function addToMap(evt) {
          var symbol;
          toolbar.deactivate();
          map.showZoomSlider();
          switch (evt.geometry.type) {
            case "point":
            case "multipoint":
              symbol = new SimpleMarkerSymbol();
              break;
            case "polyline":
              symbol = new SimpleLineSymbol();
              break;
            default:
              symbol = new SimpleFillSymbol();
              break;
          }
          var graphic = new Graphic(evt.geometry, symbol);
          map.graphics.add(graphic);
          var features = [];
            features.push(graphic);
            featureSet.features = features;
        }
        function run_service(evtObj){

        var elevation = document.getElementById("elevation").value;
        if(elevation==""){
        alert("Please enter a value for the height!");
        }

        var params = {
        "Plane_Height": elevation,
        "Area": featureSet
        }

        gp.submitJob(params, completeCallback, statusCallback);

        }

        function statusCallback(jobInfo) {
            console.log(jobInfo.jobStatus);
            if (jobInfo.jobStatus === "esriJobSubmitted") {
              $("#volstatus").html("<h7 style='color:blue'><b>Job submitted...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobExecuting") {
                $("#volstatus").html("<h7 style='color:red;'><b>Calculating...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobSucceeded") {
                $("#volstatus").html("<h7 style='color:green;'><b>Success!</b></h7>");
            }
          }

          function completeCallback(jobInfo) {
            console.log("getting data");

            gp.getResultImageLayer(jobInfo.jobId, "rastercalc", null, function (layer) {
            layer.setOpacity(0.99);
            map.addLayers([layer]);
            gp.getResultData(jobInfo.jobId, "Volume_txt", getVolume);
            });

          }

        //sends request to get volume text file from server
        function getVolume(Volume_txt) {
            var req = esriRequest({
                "url": Volume_txt.value.url,
                "handleAs": "text"
            });
            req.then(requestSucceeded);
        }

        //manipulates text dile and adds total volume to app on successful text file request
        function requestSucceeded(response){

            var elem = response.split(",");

            var volNumber = Number(elem[elem.length - 1]).toFixed(2);

            $("#volume").html(
                "<h6>Total Volume:</h6>" +
                "<p> <span id='volBlue'>" +
            volNumber + "</span> Cubic Meters</p>"
            );
        }

      });