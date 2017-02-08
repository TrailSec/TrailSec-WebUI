import GoogleMapsHelper from './google-maps-helper'
import Routes from './route-data'
import MockData from './mock-data'
import moment from 'moment'

// Global "Google-Maps" object for tracking created items
var GOOGLE_MAPS = {
  window: undefined,
  map: undefined,
  markers: [],
  infoWindows: [],
  routes: []
}

// eslint-disable-next-line
var vm = new Vue({
  el: '#sidepanel',
  data: {
    // { route: 'A', lat: 49.26204954, lng: -123.2503742, timestamp: 1485907200 }
    coordinates: MockData
  },
  computed: {
    timeArray: function () {
      return this.coordinates.map(function (e, index, arr) {
        var content = `Justin Toh has arrived at checkpoint #${e.route}`
        var time = moment.unix(e.timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${moment.unix(e.timestamp).fromNow()})`
        return { content, time }
      })
    }
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
