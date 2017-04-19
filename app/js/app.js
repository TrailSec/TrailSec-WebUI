import GoogleMapsHelper from './google-maps-helper'
import firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'

import palette from './palette'
import markerIcon from './markerIcon'

// Global "Google-Maps" object for tracking created items
let GOOGLE_MAPS = {
  window: undefined,
  map: undefined,
  markers: {},
  infoWindows: {},
  routes: []
}

/***************************************************************
 * Initialize Google Maps
 *  - Draw routes on Google Map canvas after google maps have finish loading
 ****************************************************************/
GoogleMapsHelper.createMap(GOOGLE_MAPS)

/***************************************************************
 * Initialize Vue instance to power our sidebar
 ****************************************************************/
// eslint-disable-next-line
let vm = new Vue({
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
      // Set MIN_TIME to 20th FEB 2017 for demo purposes
      minTime: 1487577600,
      // minTime: moment().subtract(1, 'year').unix(),
      maxTime: moment().add(1, 'hour').unix()
    },
    store: {
      checkInData: [],
      users: {},
      routes: {}
    }
  },
  computed: {
    // Filters in all the check-in data that user wants to see based on `userSettings`
    filteredCheckInData: function () {
      // Filtering out check-in data not within our specified timeframe
      const filteredData = this.store.checkInData.filter((e, index, arr) => {
        return (e.timestamp / 1000 >= this.userSettings.minTime) && (e.timestamp / 1000 <= this.userSettings.maxTime)
      })

      // Convert data to display on UI
      const processedData = filteredData.map((e, index, arr) => {
        const timestamp = e.timestamp / 1000
        const timeAgoString = moment.unix(timestamp).from(this.now)
        const time = moment.unix(timestamp).format('Do MMM YYYY, HH:mm:ss') + ` (${timeAgoString})`
        const content = (e.image && e.image !== '') ? `Guard [${this.store.users[e.uid].name}] has uploaded an image.`
                                                  : `Guard [${this.store.users[e.uid].name}] has checked in.`
        const markerColor = (e.image && e.image !== '') ? palette['marker-alert-color']
                                                      : (this.store.users[e.uid]) ? this.store.users[e.uid].markerColor
                                                      : palette['marker-default-color']
        const image = (e.image && e.image !== '') ? e.image : undefined
        return { route: e.route, lat: e.latitude, lng: e.longitude, id: e.id, content, time, timestamp, markerColor, image }
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
        // Draw in reverse order because we want the latest marker to be drawn over the old ones
        for (let i = arr.length - 1; i >= 0; i--) {
          GoogleMapsHelper.createMarker(GOOGLE_MAPS, arr[i].id, arr[i].lat, arr[i].lng, arr[i].timestamp, arr[i].markerColor, arr[i].image)
        }
      }
    },
    centerMapTo: function (lat, lng) {
      if (GOOGLE_MAPS.map !== undefined && GOOGLE_MAPS.window !== undefined) {
        GoogleMapsHelper.panTo(GOOGLE_MAPS, lat, lng)
      }
    },
    showInfoWindow: function (dataId) {
      const thisInfoWindow = GOOGLE_MAPS.infoWindows[dataId]
      const thisMarker = GOOGLE_MAPS.markers[dataId]
      thisInfoWindow.open(GOOGLE_MAPS.map, thisMarker)
    },
    hideInfoWindow: function (dataId) {
      const thisInfoWindow = GOOGLE_MAPS.infoWindows[dataId]
      const thisMarker = GOOGLE_MAPS.markers[dataId]
      thisInfoWindow.close(GOOGLE_MAPS.map, thisMarker)
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
 *  - Listen for database updates in real-time
 *  - On every update, feed new data into our sidepanel via Vue.js's Reactive Props
 ****************************************************************/
// firebase.initializeApp({databaseURL: 'https://cpen391-poc.firebaseio.com/'}) // STAGING
firebase.initializeApp({databaseURL: 'https://cpen391-trailsec.firebaseio.com/'}) // PRODUCTION

firebase.database().ref('/Users').on('value', snapshot => {
  vm.store.users = snapshot.val()
})
firebase.database().ref('/Routes').on('value', snapshot => {
  vm.store.routes = _.chain(snapshot.val())
                      .mapValues((value, key) => {
                        // For each route, every coordinate object will have its corresponding index mapped into 'id' so that Google Maps SDK can draw it
                        value.map((e, index, arr) => { e.id = index; return e })
                        return value
                      })
                      .value()                        // unwraps lodash wrapper to get chain() results

  // Draw every route on Google Maps
  for (let key in vm.store.routes) {
    GoogleMapsHelper.drawRoute(GOOGLE_MAPS, vm.store.routes[key], palette['primary-color'])
  }
})
firebase.database().ref('/CheckedInData').on('value', snapshot => {
  vm.store.checkInData = _.chain(snapshot.val())
                          .mapValues((value, key) => {    // preserve keys before converting to array
                            value.id = key
                            return value
                          })
                          .toArray()                      // convert `rawData` into an array (removes firebase's pushId keys)
                          .orderBy('timestamp', 'desc')   // sort by most recent timestamp
                          .value()                        // unwraps lodash wrapper to get chain() results
})
