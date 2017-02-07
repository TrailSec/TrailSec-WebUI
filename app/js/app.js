import GoogleMapsLoader from 'google-maps'
import GoogleMapsHelper from './google-maps-helper'
import Routes from './route-data'

// Global "Google-Maps" object for tracking created items
var GOOGLE_MAPS = {
  window: undefined,
  map: undefined,
  markers: [],
  infoWindows: [],
  routes: []
}

GoogleMapsLoader.KEY = 'AIzaSyAAAAffx49N0OrzfkADhTms8cc-IFzrUHI'
GoogleMapsLoader.REGION = 'CA'
GoogleMapsLoader.load(google => {
  GOOGLE_MAPS.window = google
  GOOGLE_MAPS.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {lat: 49.26256765463452, lng: -123.25080871582031},
    mapTypeControl: false, // disable toggle between MAP/SATELLITE
    streetViewControl: false, // disable STREETVIEW
    rotateControl: true
  })

  // google.maps.event.addListener(MAP_INSTANCE, 'click', function (event) {
  //   var lat = event.latLng.lat()
  //   var lng = event.latLng.lng()
  //   // populate yor box/field with lat, lng
  //   console.log(lat + ', ' + lng)
  // })

  // Sample function to test out polylines creation
  GOOGLE_MAPS.routes.push(GoogleMapsHelper.drawRoute(GOOGLE_MAPS, Routes.routeA, '#e64c65'))
})

// Sample function to test out marker + infoWindow creation
var ii = 0
document.getElementById('addMarker').addEventListener('click', function () {
  if (ii >= Routes.routeA.length) {
    window.alert('No more markers to add!')
  } else {
    var tempMarker = GoogleMapsHelper.createMarker(GOOGLE_MAPS, Routes.routeA[ii].lat, Routes.routeA[ii].lng)
    GOOGLE_MAPS.markers.push(tempMarker)
    GOOGLE_MAPS.infoWindows.push(GoogleMapsHelper.createInfoWindow(GOOGLE_MAPS, tempMarker, Routes.routeA[ii].timestamp))
    ii++
  }
})
document.getElementById('clearMarkers').addEventListener('click', function () {
  ii = 0
  GoogleMapsHelper.clearMarkers(GOOGLE_MAPS)
})
