// Convert our unix timestamps to human-readable string using Moment.js library
import moment from 'moment'

module.exports = {
  // Create a marker on the google map (based on the provided lat, lng)
  createMarker: function (googleMaps, lat, lng) {
    var google = googleMaps.window
    var map = googleMaps.map

    var marker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      title: 'TEST',
      animation: google.maps.Animation.DROP,
      icon: {
        url: '../images/map-marker-icon.png',
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32)
      },
      // Shapes define the clickable region of the icon
      shape: {
        coords: [15.5, 0, 5, 20, 32, 32, 27, 20],
        type: 'poly'
      },
      optimized: false,
      map: map
    })
    return marker
  },

  // Remove all markers
  clearMarkers: function (googleMaps) {
    for (let i = 0; i < googleMaps.markers.length; i++) {
      console.log('lol')
      googleMaps.markers[i].setMap(null)
    }
    googleMaps.markers.length = 0
  },

  // Create a marker on the google map (based on the provided lat, lng)
  createInfoWindow: function (googleMaps, marker, timestamp) {
    var google = googleMaps.window
    var map = googleMaps.map

    var infoWindow = new google.maps.InfoWindow({
      content: `<div>Checked in at ${moment.unix(timestamp).format('Do MMM YY (ddd), HH:mm:ss')}</div>`
    })
    marker.addListener('mouseover', function () { infoWindow.open(map, marker) })
    marker.addListener('mouseout', function () { infoWindow.close(map, marker) })
    return infoWindow
  },

  // Draws a polyline on the google map (based on the provided array of coordinates)
  drawRoute: function (googleMaps, coordinatesArray, color) {
    var google = googleMaps.window
    var map = googleMaps.map

    var thisRoute = new google.maps.Polyline({
      path: coordinatesArray,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    })
    thisRoute.setMap(map)
    return thisRoute
  }
}
