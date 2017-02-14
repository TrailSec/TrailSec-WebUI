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

GoogleMapsHelper.createMap(GOOGLE_MAPS, function () {
  // Draw routes on Google Map canvas
  GoogleMapsHelper.drawRoute(GOOGLE_MAPS, Routes.routeA, '#e64c65')
  // Draw markers on Google Map canvas
  vm.plotFilteredCheckInData()
})

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
      // var tempArr = this.checkInData

      // TODO: add filtering logic
      //
      //
      //

      return this.checkInData
    },
    // Converts our `filteredCheckInData` into human-readable data to be displayed on our UI
    processedCheckInData: function () {
      this.plotFilteredCheckInData()

      return this.filteredCheckInData.map(function (e, index, arr) {
        var content = `Justin Toh has arrived at checkpoint #${e.route}`
        var time = moment.unix(e.timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${moment.unix(e.timestamp).fromNow()})`
        var lat = e.lat
        var lng = e.lng
        return { content, time, lat, lng }
      })
    }
  },
  methods: {
    plotFilteredCheckInData: function () {
      if (GOOGLE_MAPS.map !== undefined && GOOGLE_MAPS.window !== undefined) {
        // Clear all the markers before redrawing new ones
        GoogleMapsHelper.clearMarkers(GOOGLE_MAPS)

        // Draw markers on Google Maps canvas for each check-in data entry
        this.filteredCheckInData.forEach(function (e, index, arr) {
          GoogleMapsHelper.createMarker(GOOGLE_MAPS, e.lat, e.lng)
        })
      }
    }
  }
})
