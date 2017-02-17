import GoogleMapsHelper from './google-maps-helper'
import firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'

import Routes from './route-data'

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

  // Force the Vue instance to re-render after Google Maps have finished loading
  vm.$forceUpdate()
})

// eslint-disable-next-line
var vm = new Vue({
  el: '#sidepanel',
  data: {
    nowUpdate: false,
    now: moment(),
    checkInData: [],
    userSettings: {
      minTime: moment().subtract(1, 'day').unix(),
      maxTime: moment().add(1, 'hour').unix()
    }
  },
  computed: {
    // Filters in all the check-in data that user wants to see based on `userSettings`
    filteredCheckInData: function () {
      // Filtering out check-in data not within our specified timeframe
      var filteredData = this.checkInData.filter((e, index, arr) => {
        return (e.timestamp / 1000 >= this.userSettings.minTime) && (e.timestamp / 1000 <= this.userSettings.maxTime)
      })

      // Convert data to display on UI
      var processedData = filteredData.map((e, index, arr) => {
        var timestamp = e.timestamp / 1000
        var timeAgoString = moment.unix(timestamp).from(this.now)
        var content = `Justin Toh has arrived at checkpoint #${e.route}`
        var time = moment.unix(timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${timeAgoString})`
        return { route: e.route, lat: e.latitude, lng: e.longitude, content, time, timestamp: e.timestamp }
      })

      // If view updates is triggered by setting the "now" variable, do not redraw markers!
      if (this.nowUpdate) {
        this.nowUpdate = false
      } else {
        this.plotMarkersOnMap(processedData)
      }

      return processedData
    },
    currentFromDatetime: function () {
      return moment.unix(this.userSettings.minTime).format('dddd Do MMM YYYY, HH:mm')
    },
    currentToDatetime: function () {
      return moment.unix(this.userSettings.maxTime).format('dddd Do MMM YYYY, HH:mm')
    }
  },
  methods: {
    // Draw markers on Google Map canvas for each element in `arr`
    plotMarkersOnMap: function (arr) {
      if (GOOGLE_MAPS.map !== undefined && GOOGLE_MAPS.window !== undefined) {
        GoogleMapsHelper.clearMarkers(GOOGLE_MAPS)
        arr.forEach(function (e, index, arr) {
          GoogleMapsHelper.createMarker(GOOGLE_MAPS, e.lat, e.lng)
        })
      }
    }
  },
  mounted: function () {
    // Updates `now` variable every minute to recompute the `timeAgoString` value
    setInterval(() => {
      this.nowUpdate = true
      this.now = Date.now()
    }, 1000)
  }
})

console.log('vue done')

// Initialize datatime picker widget
// eslint-disable-next-line
const picker = new MaterialDatePicker()
    .on('submit', (val) => { vm.userSettings.minTime = val / 1000 })
// eslint-disable-next-line
const picker2 = new MaterialDatePicker()
    .on('submit', (val) => { vm.userSettings.maxTime = val / 1000 })
document.querySelector('#setFromDatetime')
  .addEventListener('click', () => {
    picker.open() || picker.set(vm.userSettings.minTime * 1000)
  })
document.querySelector('#setToDatetime')
  .addEventListener('click', () => {
    picker2.open() || picker2.set(vm.userSettings.maxTime * 1000)
  })

console.log('picker done')

// Initialize Firebase
firebase.initializeApp({
  databaseURL: 'https://cpen391-poc.firebaseio.com/'
})

// Listen for database updates in realtime & feed it into our Vue instance
firebase.database().ref('/Geolocation').orderByValue().on('value', function (snapshot) {
  vm.checkInData = _.chain(snapshot.val())
                      .toArray()                      // convert `rawData` into an array (removes firebase's pushId keys)
                      .orderBy('timestamp', 'desc')   // sort by most recent timestamp
                      .value()                        // unwraps lodash wrapper to get chain() results
  console.log('firebase update')
})

console.log('firebase done')
