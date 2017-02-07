import GoogleMapsLoader from 'google-maps'
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

GoogleMapsLoader.KEY = 'AIzaSyAAAAffx49N0OrzfkADhTms8cc-IFzrUHI'
GoogleMapsLoader.REGION = 'CA'
GoogleMapsLoader.load(google => {
  GOOGLE_MAPS.window = google
  GOOGLE_MAPS.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {lat: 49.26256765463452, lng: -123.25080871582031},
    mapTypeControl: false, // disable toggle between MAP/SATELLITE
    streetViewControl: false, // disable STREETVIEW
    rotateControl: true
    // styles: [
    //   {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    //   {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    //   {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    //   {
    //     featureType: 'administrative.locality',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#d59563'}]
    //   },
    //   {
    //     featureType: 'poi',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#d59563'}]
    //   },
    //   {
    //     featureType: 'poi.park',
    //     elementType: 'geometry',
    //     stylers: [{color: '#263c3f'}]
    //   },
    //   {
    //     featureType: 'poi.park',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#6b9a76'}]
    //   },
    //   {
    //     featureType: 'road',
    //     elementType: 'geometry',
    //     stylers: [{color: '#38414e'}]
    //   },
    //   {
    //     featureType: 'road',
    //     elementType: 'geometry.stroke',
    //     stylers: [{color: '#212a37'}]
    //   },
    //   {
    //     featureType: 'road',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#9ca5b3'}]
    //   },
    //   {
    //     featureType: 'road.highway',
    //     elementType: 'geometry',
    //     stylers: [{color: '#746855'}]
    //   },
    //   {
    //     featureType: 'road.highway',
    //     elementType: 'geometry.stroke',
    //     stylers: [{color: '#1f2835'}]
    //   },
    //   {
    //     featureType: 'road.highway',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#f3d19c'}]
    //   },
    //   {
    //     featureType: 'transit',
    //     elementType: 'geometry',
    //     stylers: [{color: '#2f3948'}]
    //   },
    //   {
    //     featureType: 'transit.station',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#d59563'}]
    //   },
    //   {
    //     featureType: 'water',
    //     elementType: 'geometry',
    //     stylers: [{color: '#17263c'}]
    //   },
    //   {
    //     featureType: 'water',
    //     elementType: 'labels.text.fill',
    //     stylers: [{color: '#515c6d'}]
    //   },
    //   {
    //     featureType: 'water',
    //     elementType: 'labels.text.stroke',
    //     stylers: [{color: '#17263c'}]
    //   }
    // ]
  })

  // google.maps.event.addListener(MAP_INSTANCE, 'click', function (event) {
  //   var lat = event.latLng.lat()
  //   var lng = event.latLng.lng()
  //   // populate yor box/field with lat, lng
  //   console.log(lat + ', ' + lng)
  // })

  // Sample function to test out polylines creation
  GOOGLE_MAPS.routes.push(GoogleMapsHelper.drawRoute(GOOGLE_MAPS, Routes.routeA, '#e64c65'))
})

// Sample function to test out marker + infoWindow creation
var ii = 0
document.getElementById('abc').addEventListener('click', function () {
  if (ii >= Routes.routeA.length) {
    window.alert('No more markers to add!')
  } else {
    var tempMarker = GoogleMapsHelper.createMarker(GOOGLE_MAPS, Routes.routeA[ii].lat, Routes.routeA[ii].lng)
    GOOGLE_MAPS.markers.push(tempMarker)
    GOOGLE_MAPS.infoWindows.push(GoogleMapsHelper.createInfoWindow(GOOGLE_MAPS, tempMarker, Routes.routeA[ii].timestamp))
    ii++
  }
})
