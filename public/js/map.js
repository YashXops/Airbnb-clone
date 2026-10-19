const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/standard', // Map style to use
        center: coordinates, // Starting position [lng, lat]
        zoom: 12 // Starting zoom level
      });

const marker = new mapboxgl.Marker() // initialize a new marker
    .setLngLat(coordinates) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map