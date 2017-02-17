import GoogleMapsHelper from './google-maps-helper'
import firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'

import palette from './palette'
import Routes from './route-data'

// Global "Google-Maps" object for tracking created items
var GOOGLE_MAPS = {
  window: undefined,
  map: undefined,
  markers: [],
  infoWindows: [],
  routes: []
}

/***************************************************************
 * Initialize Google Maps
 *  - Draw routes on Google Map canvas after google maps have finish loading
 ****************************************************************/
GoogleMapsHelper.createMap(GOOGLE_MAPS, function () {
  GoogleMapsHelper.drawRoute(GOOGLE_MAPS, Routes.routeA, palette['primary-color'])
})

/***************************************************************
 * Initialize Vue instance to power our sidebar
 ****************************************************************/
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
        // var content = `Guard #${e.uid} has arrived at checkpoint #${e.route}`
        var content = `Guard #${e.uid} has checked-in (Route #${e.route})`
        var time = moment.unix(timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${timeAgoString})`
        return { route: e.route, lat: e.latitude, lng: e.longitude, content, time, timestamp: e.timestamp }
      })

      // If view updates is triggered by setting the "now" variable, do not redraw markers!
      if (!this.nowUpdate) {
        this.plotMarkersOnMap(processedData)
      }

      this.nowUpdate = false
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
          GoogleMapsHelper.createMarker(GOOGLE_MAPS, e.lat, e.lng, e.timestamp)
        })
      }
    },
    centerMapTo: function (lat, lng) {
      if (GOOGLE_MAPS.map !== undefined && GOOGLE_MAPS.window !== undefined) {
        GoogleMapsHelper.panTo(GOOGLE_MAPS, lat, lng)
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

/***************************************************************
 * Initialize datatime picker widget
 ****************************************************************/
 // eslint-disable-next-line
const fromDatetimePicker = new MaterialDatePicker()
    .on('submit', value => { vm.userSettings.minTime = value / 1000 })
// eslint-disable-next-line
const toDatetimePicker = new MaterialDatePicker()
    .on('submit', value => { vm.userSettings.maxTime = value / 1000 })
document.querySelector('#fromDatetimeBtn')
  .addEventListener('click', () => {
    fromDatetimePicker.open() || fromDatetimePicker.set(vm.userSettings.minTime * 1000)
  })
document.querySelector('#toDatetimeBtn')
  .addEventListener('click', () => {
    toDatetimePicker.open() || toDatetimePicker.set(vm.userSettings.maxTime * 1000)
  })

/***************************************************************
 * Initialize Firebase Connection
 *  - Listen for database updates in realtime
 *  - On every update, feed date into our sidepanel via Vue.js
 ****************************************************************/
firebase.initializeApp({databaseURL: 'https://cpen391-poc.firebaseio.com/'})
firebase.database().ref('/Geolocation').on('value', snapshot => {
  vm.checkInData = _.chain(snapshot.val())
                      .toArray()                      // convert `rawData` into an array (removes firebase's pushId keys)
                      .orderBy('timestamp', 'desc')   // sort by most recent timestamp
                      .value()                        // unwraps lodash wrapper to get chain() results
})
