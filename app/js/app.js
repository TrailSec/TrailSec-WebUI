// import * as hello from './hello.js'
const hello = require('./hello.js')
const firebase = require('firebase')

// Initialize Firebase
var config = {
  apiKey: '<API_KEY>',
  authDomain: '<PROJECT_ID>.firebaseapp.com',
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  storageBucket: '<BUCKET>.appspot.com'
}
firebase.initializeApp(config)

console.log(`Importing ${hello}`)
