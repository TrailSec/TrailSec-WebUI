module.exports = {
  // Create a marker on the google map (based on the provided lat, lng)
  createMarker: function (google, mapInstance, lat, lng) {
    return new google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: mapInstance
    })
  },

  // Draws a polyline on the google map (based on the provided array of coordinates)
  drawRoute: function (google, mapInstance, coordinatesArray) {
    var thisRoute = new google.maps.Polyline({
      path: coordinatesArray,
      strokeColor: '#3B8B54',
      strokeOpacity: 1.0,
      strokeWeight: 2
    })
    thisRoute.setMap(mapInstance)
    return thisRoute
  }
}
