import GoogleMapsLoader from 'google-maps'
import GoogleMapsHelper from './google-maps-helper'
import Routes from './route-data'
var GMAP
var GMAP_MAP_INSTANCE
var GMAP_MARKER_LIST = []
var GMAP_ROUTES_LIST = []

GoogleMapsLoader.KEY = 'AIzaSyAAAAffx49N0OrzfkADhTms8cc-IFzrUHI'
GoogleMapsLoader.REGION = 'CA'
GoogleMapsLoader.load(google => {
  // var uluru = {lat: 49.2765, lng: -123.2177}
  GMAP = google
  GMAP_MAP_INSTANCE = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 49.26256765463452, lng: -123.25080871582031},
    mapTypeControl: false, // disable toggle between MAP/SATELLITE
    streetViewControl: false, // disable STREETVIEW
    rotateControl: true
  })

  // google.maps.event.addListener(MAP_INSTANCE, 'click', function (event) {
  //   var lat = event.latLng.lat()
  //   var lng = event.latLng.lng()
  //   // populate yor box/field with lat, lng
  //   console.log(lat + ', ' + lng)
  // })

  GMAP_ROUTES_LIST.push(GoogleMapsHelper.drawRoute(GMAP, GMAP_MAP_INSTANCE, Routes.routeA))
})

var ii = 0
document.getElementById('abc').addEventListener('click', function () {
  if (ii >= Routes.routeA.length) {
    ii = 0
  }
  GMAP_MARKER_LIST.push(GoogleMapsHelper.createMarker(GMAP, GMAP_MAP_INSTANCE, Routes.routeA[ii].lat, Routes.routeA[ii].lng))
  ii++
})

// const firebase = require('firebase')
// // Initialize Firebase
// var config = {
//   apiKey: '<API_KEY>',
//   authDomain: '<PROJECT_ID>.firebaseapp.com',
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
//   storageBucket: '<BUCKET>.appspot.com'
// }
// firebase.initializeApp(config)
