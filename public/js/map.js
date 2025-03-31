//  var map = new maplibregl.Map({
//             container: 'map', // container id
//             style: 'https://demotiles.maplibre.org/style.json', // style URL
//             center: [77.2088, 28.6139], // starting position [lng, lat]
//             zoom: 6 // starting zoom
//         });
//  map.on('load', function () {
//             console.log('Map has loaded successfully!');
//         });
var map = L.map('map').setView(listing.geometry.coordinates, 6); // India

// Use OpenStreetMap tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">Carto</a> & OpenStreetMap contributors'
}).addTo(map);

var marker; 


// Add a new marker to the specific location
marker =('onclick', L.marker(listing.geometry.coordinates).addTo(map)
    .bindPopup(`<b>${listing.location}</b><br>Exact Location provided after Booking`)
   

)
// Move map to the new marker
// map.setView(coordinates, 10);
// map.on('click', function (e) {
//     L.popup()
//     .setLatLng(e.latlng)
//     .setContent(`You clicked at <b>Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}</b>`)
//     .openOn(map);
// });