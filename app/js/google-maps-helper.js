// Convert our unix timestamps to human-readable string using Moment.js library
import moment from 'moment'
import _ from 'lodash'
import GoogleMapsLoader from 'google-maps'
import Routes from './route-data'

module.exports = {
  // Create a map instance to render on the page
  createMap: function (googleMaps) {
    GoogleMapsLoader.KEY = 'AIzaSyAAAAffx49N0OrzfkADhTms8cc-IFzrUHI'
    GoogleMapsLoader.REGION = 'CA'
    GoogleMapsLoader.load(google => {
      googleMaps.window = google
      googleMaps.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: 49.26256765463452, lng: -123.25080871582031},
        mapTypeControl: false, // disable toggle between MAP/SATELLITE
        streetViewControl: false // disable STREETVIEW
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
      var testRoute = this.drawRoute(googleMaps, Routes.routeA, '#e64c65')
      googleMaps.routes.push(testRoute)
    })
  },

  // Create a marker on the google map (based on the provided lat, lng)
  createMarker: function (googleMaps, lat, lng) {
    const google = googleMaps.window
    const map = googleMaps.map

    const marker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      title: 'TEST',
      animation: google.maps.Animation.DROP,
      icon: {
        url: '../images/map-marker-icon.png',
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32)
      },
      // Shapes define the clickable region of the icon
      shape: {
        coords: [15.5, 0, 5, 20, 32, 32, 27, 20],
        type: 'poly'
      },
      optimized: false,
      map: map
    })
    return marker
  },

  // Remove all markers
  clearMarkers: function (googleMaps) {
    for (let i = 0; i < googleMaps.markers.length; i++) {
      console.log('lol')
      googleMaps.markers[i].setMap(null)
    }
    googleMaps.markers.length = 0
  },

  // Create a marker on the google map (based on the provided lat, lng)
  createInfoWindow: function (googleMaps, marker, timestamp) {
    const google = googleMaps.window
    const map = googleMaps.map

    const infoWindow = new google.maps.InfoWindow({
      content: `<div>Checked in at ${moment.unix(timestamp).format('Do MMM YY (ddd), HH:mm:ss')}</div>`
    })
    marker.addListener('mouseover', function () { infoWindow.open(map, marker) })
    marker.addListener('mouseout', function () { infoWindow.close(map, marker) })
    return infoWindow
  },

  // Draws a polyline on the google map (based on the provided array of coordinates)
  drawRoute: function (googleMaps, coordinatesArray, color) {
    const google = googleMaps.window
    const map = googleMaps.map

    // Appends the first checkpoint to the array so our route will have a polyline
    // drawn from the last checkpoint to the first checkpoint (forming a loop)
    if (coordinatesArray.length > 0) {
      const startingPoint = _.clone(coordinatesArray[0], false)
      coordinatesArray.push(startingPoint)
    }

    const thisRoute = new google.maps.Polyline({
      path: coordinatesArray,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    })
    thisRoute.setMap(map)
    return thisRoute
  }
}
