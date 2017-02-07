import Vue from './libs/vue.js'
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

// eslint-disable-next-line no-unused-vars
var vm = new Vue({
  el: '#sidepanel',
  data: {
    coordinates: [
      {content: 'Justin Toh has arrived at checkpoint #A-13', time: '1st Jan 2017, 12:40:12 (12mins ago)'},
      {content: 'Justin Toh has arrived at checkpoint #A-12', time: '1st Jan 2017, 12:39:59 (13mins ago)'},
      {content: 'Justin Toh has arrived at checkpoint #A-11', time: '1st Jan 2017, 12:38:05 (14mins ago)'},
      {content: 'Justin Toh has arrived at checkpoint #A-10', time: '1st Jan 2017, 12:37:10 (15mins ago)'}
      // {content: 'Justin Toh has arrived at checkpoint #A-09', time: '1st Jan 2017, 12:38:10 (16mins ago)'},
      // {content: 'Justin Toh has arrived at checkpoint #A-08', time: '1st Jan 2017, 12:39:10 (17mins ago)'},
      // {content: 'Justin Toh has arrived at checkpoint #A-07', time: '1st Jan 2017, 12:39:10 (17mins ago)'},
      // {content: 'Justin Toh has arrived at checkpoint #A-06', time: '1st Jan 2017, 12:40:10 (18mins ago)'},
      // {content: 'Justin Toh has arrived at checkpoint #A-05', time: '1st Jan 2017, 12:41:10 (19mins ago)'}
    ]
  }
})

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
