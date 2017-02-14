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
    checkInData: MockData,
    userSettings: { minTime: 0, maxTime: 0 }
  },
  computed: {
    // Filters in all the check-in data that user wants to see based on `userSettings`
    filteredCheckInData: function () {
      return this.checkInData
    },
    // Converts our `filteredCheckInData` into human-readable data to be displayed on our UI
    processedCheckInData: function () {
      return this.filteredCheckInData.map(function (e, index, arr) {
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
    GoogleMapsHelper.createMarker(GOOGLE_MAPS, Routes.routeA[ii].lat, Routes.routeA[ii].lng)
    ii++
  }
})
document.getElementById('clearMarkers').addEventListener('click', function () {
  ii = 0
  GoogleMapsHelper.clearMarkers(GOOGLE_MAPS)
})
