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
    now: Date.now(),
    checkInData: [],
    userSettings: { minTime: 0, maxTime: 0 }
  },
  computed: {
    // Filters in all the check-in data that user wants to see based on `userSettings`
    filteredCheckInData: function () {
      var filteredData = this.checkInData

      // TODO: add filtering logic
      //
      //
      //

      var processedData = filteredData.map((e, index, arr) => {
        var timestamp = e.timestamp / 1000
        var timeAgoString = moment.unix(timestamp).from(this.now)
        var content = `Justin Toh has arrived at checkpoint #${e.route}`
        var time = moment.unix(timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${timeAgoString})`
        return { route: e.route, lat: e.lat, lng: e.lng, content, time, timestamp: e.timestamp }
      })

      // If view updates is triggered by setting the "now" variable, do not redraw markers!
      if (this.nowUpdate) {
        this.nowUpdate = false
      } else {
        this.plotMarkersOnMap(processedData)
      }

      return processedData
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
    }, 1000 * 60)
  }
})

console.log('vue done')

// Initialize datatime picker widget
const picker = new MaterialDatePicker()
    .on('submit', (val) => {
      document.querySelector('#events').innerHTML += val.toDate() + '\n'
    })
    .on('open', () => {
      document.querySelector('#events').innerHTML += 'open\n'
    })
    .on('close', () => {
      document.querySelector('#events').innerHTML += 'close\n'
    })

document.querySelector('.sign-in')
    .addEventListener('click', () => picker.open() || picker.set(moment()))

console.log('picker done')

// Initialize Firebase
firebase.initializeApp({
  databaseURL: 'https://cpen391-poc.firebaseio.com/'
})

// Listen for database updates in realtime & feed it into our Vue instance
firebase.database().ref('/geolocation-data').orderByValue().on('value', function (snapshot) {
  vm.checkInData = _.chain(snapshot.val())
                      .toArray()                      // convert `rawData` into an array (removes firebase's pushId keys)
                      .orderBy('timestamp', 'desc')   // sort by most recent timestamp
                      .value()                        // unwraps lodash wrapper to get chain() results
})

console.log('firebase done')
