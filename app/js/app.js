const GoogleMapsLoader = require('google-maps')
// const firebase = require('firebase')
//
// // Initialize Firebase
// var config = {
//   apiKey: '<API_KEY>',
//   authDomain: '<PROJECT_ID>.firebaseapp.com',
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
//   storageBucket: '<BUCKET>.appspot.com'
// }
// firebase.initializeApp(config)

GoogleMapsLoader.KEY = 'AIzaSyAAAAffx49N0OrzfkADhTms8cc-IFzrUHI'
GoogleMapsLoader.REGION = 'CA'
GoogleMapsLoader.load(function (google) {
  var uluru = {lat: 49.2765, lng: -123.2177}
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  })
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  })
})
