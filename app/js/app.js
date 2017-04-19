import GoogleMapsHelper from './google-maps-helper'
import firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'

import palette from './palette'
import Routes from './route-data'
import markerIcon from './markerIcon'

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
  components: {
    'markerIcon': markerIcon
  },
  data: {
    fromDatetimeBtnText: '',
    toDatetimeBtnText: '',
    nowUpdate: false,
    now: moment(),
    userSettings: {
      minTime: moment().subtract(1, 'day').unix(),
      maxTime: moment().add(1, 'hour').unix()
    },
    stores: {
      checkInData: [],
      users: {},
      routes: {}
    }
  },
  computed: {
    // Filters in all the check-in data that user wants to see based on `userSettings`
    filteredCheckInData: function () {
      // Filtering out check-in data not within our specified timeframe
      var filteredData = this.stores.checkInData.filter((e, index, arr) => {
        return (e.timestamp / 1000 >= this.userSettings.minTime) && (e.timestamp / 1000 <= this.userSettings.maxTime)
      })

      // Convert data to display on UI
      var processedData = filteredData.map((e, index, arr) => {
        var timestamp = e.timestamp / 1000
        var timeAgoString = moment.unix(timestamp).from(this.now)
        var content = `Guard #${e.uid} has checked in.`
        var time = moment.unix(timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${timeAgoString})`
        return {
          route: e.route,
          lat: e.latitude,
          lng: e.longitude,
          content,
          time,
          timestamp: timestamp,
          markerColor: (e.image) ? palette['marker-alert-color'] : palette['marker-default-color'],
          image: (e.image) ? e.image : undefined
        }
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
        console.table(arr)
        arr.forEach(function (e, index, arr) {
          if (e.image === undefined) {
            GoogleMapsHelper.createMarker(GOOGLE_MAPS, e.lat, e.lng, e.timestamp, palette['marker-default-color'])
          } else {
            GoogleMapsHelper.createMarker(GOOGLE_MAPS, e.lat, e.lng, e.timestamp, palette['marker-alert-color'], e.image)
          }
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

    // Update TO + FROM button text
    this.fromDatetimeBtnText = this.currentFromDatetime
    this.toDatetimeBtnText = this.currentToDatetime
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
// firebase.initializeApp({databaseURL: 'https://cpen391-poc.firebaseio.com/'}) // STAGING
firebase.initializeApp({databaseURL: 'https://cpen391-trailsec.firebaseio.com/'}) // PRODUCTION
firebase.database().ref('/CheckedInData').on('value', snapshot => {
  vm.stores.checkInData = _.chain(snapshot.val())
                      .toArray()                      // convert `rawData` into an array (removes firebase's pushId keys)
                      .orderBy('timestamp', 'desc')   // sort by most recent timestamp
                      .value()                        // unwraps lodash wrapper to get chain() results
})
firebase.database().ref('/Users').on('value', snapshot => {
  vm.stores.users = snapshot.val()
})
firebase.database().ref('/Routes').on('value', snapshot => {
  vm.stores.routes = snapshot.val()
})
