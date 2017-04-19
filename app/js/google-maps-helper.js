// Convert our unix timestamps to human-readable string using Moment.js library
import moment from 'moment'
import _ from 'lodash'
import GoogleMapsLoader from 'google-maps'
import MarkerGenerator from './marker-generator'

module.exports = {
  /***************************************************************
   * Create a map instance to render on the page
   ****************************************************************/
  createMap: function (googleMaps, callback) {
    // Secure the key by restricting access on Google API manager
    GoogleMapsLoader.KEY = 'AIzaSyAmXZa39VvogISSdytzFY-DGxxNZsu4Pj4'
    GoogleMapsLoader.REGION = 'CA'
    GoogleMapsLoader.load(google => {
      googleMaps.window = google
      googleMaps.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: 49.26256765463452, lng: -123.25080871582031},
        mapTypeControl: false, // disable toggle between MAP/SATELLITE
        streetViewControl: false // disable STREETVIEW
      })

      // Execute CALLBACK function when the Google Maps has finished loading
      google.maps.event.addListenerOnce(googleMaps.map, 'idle', callback)
    })
  },

  /***************************************************************
   * Create a marker on the google map (based on the provided lat, lng)
   ****************************************************************/
  createMarker: function (googleMaps, lat, lng, timestamp, color, image) {
    const google = googleMaps.window
    const map = googleMaps.map

    const marker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      title: `${lat}, ${lng}`,
      animation: google.maps.Animation.DROP,
      icon: {
        url: MarkerGenerator.createSVGMarker(color),
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

    // Append newly created marker into an array for tracking purposes
    googleMaps.markers.push(marker)

    // Create a corresponding infoWindow for marker
    var infoWindow = this.createInfoWindow(googleMaps, marker, timestamp, image)
    googleMaps.infoWindows.push(infoWindow)

    return marker
  },

  // Remove all markers
  clearMarkers: function (googleMaps) {
    for (let i = 0; i < googleMaps.markers.length; i++) {
      googleMaps.markers[i].setMap(null)
    }
    googleMaps.markers.length = 0
  },

  /***************************************************************
   * Create a marker on the google map (based on the provided lat, lng)
   ****************************************************************/
  createInfoWindow: function (googleMaps, marker, timestamp, image) {
    const google = googleMaps.window
    const map = googleMaps.map
    var infoWindow

    if (image === undefined) {
      infoWindow = new google.maps.InfoWindow({
        content: `<div class="infoWindow">
            <p>Checked in at ${moment.unix(timestamp).format('Do MMM YY (ddd), HH:mm:ss')}</p>
          </div>`
      })
    } else {
      infoWindow = new google.maps.InfoWindow({
        content: `<div class="infoWindow infoImageWindow">
            <p>Uploaded at ${moment.unix(timestamp).format('Do MMM YY (ddd), HH:mm:ss')}</p>
            <div>
              <img class="image" src=${image}>
            </div>
          </div>`
      })
    }
    marker.addListener('mouseover', function () { infoWindow.open(map, marker) })
    marker.addListener('mouseout', function () { infoWindow.close(map, marker) })
    return infoWindow
  },

  /***************************************************************
   * Draws a polyline on the google map (based on the provided array of coordinates)
   ****************************************************************/
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
      strokeWeight: 5
    })
    thisRoute.setMap(map)

    // Append newly created route into an array for tracking purposes
    googleMaps.routes.push(thisRoute)
    return thisRoute
  },

  panTo: function (googleMaps, lat, lng) {
    const google = googleMaps.window
    const map = googleMaps.map

    const latLng = new google.maps.LatLng(lat, lng)
    map.panTo(latLng)
    map.setZoom(19)
  }
}
