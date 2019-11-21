// Store our API endpoint inside eqUrl
var eqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// var eqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

console.log(eqUrl);

// Perform a GET request to the query URL
d3.json(eqUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var quakeMarkers = [];

  for (var i = 0; i < earthquakeData.length; i++) {

    // Conditionals for magnitude colors
    var color = "";
    if (earthquakeData[i].properties.mag > 5) {
      color = "#003f5c";
    }
    else if (earthquakeData[i].properties.mag > 4) {
      color = "#7a5195";
    }
    else if (earthquakeData[i].properties.mag > 3) {
      color = "#ef5675";
    }
    else {
      color = "#ffa600";
    }

    // Add circles to map
    quakeMarkers.push(
      L.circle(earthquakeData[i].geometry.coordinates, {
        fillOpacity: 0.75,
        color: color,
        fillColor: color,
        radius: (earthquakeData[i].properties.mag) * 10000
      }).bindPopup("<h2>" + earthquakeData[i].properties.place + "</h2> <hr> <h3>Magnitude of earthquake: " + (earthquakeData[i].properties.mag) + "</h3>"));
}

  // createMap(L.layerGroup(quakeMarkers));
  var quake = L.layerGroup(quakeMarkers);
  createMap(quake);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      51.51, 0.12
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


