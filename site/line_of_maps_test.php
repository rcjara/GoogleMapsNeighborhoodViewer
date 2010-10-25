<html>
	<head>
		<title>Is this working?</title>
		<style type="text/css">
			html { height: 100% }
			body { height: 100%; margin: 0px; padding: 0px }
			#map_canvas { height: 100% }
		</style>
		<script type="text/javascript"
				src="http://maps.google.com/maps/api/js?sensor=false">
		</script>
		<script type="text/javascript" src="scripts/LineOfMaps.js"></script>
		<script type="text/javascript">
      var controller;

      function initialize() {
        var orig = new google.maps.LatLng(41.706394, -85.972);
        var dest = new google.maps.LatLng(41.70994, -85.972115);

        var map_options = {
          center: orig,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("initial_map"), map_options);

        google.maps.event.addListener(map, 'click', function(event) {
          controller.click(event);
        });
        
        controller = new LineOfMaps("main_body", 0.0002, null, null);
      }
    </script>

			
	</head>
	<body onload="initialize();">
    <div id="initial_map" style="height: 500px; width: 500px; background-color: #333;"></div><br />
		<div id="main_body"></div>
	</body>
</html>

