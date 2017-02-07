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

GoogleMapsHelper.createMap(GOOGLE_MAPS)

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
