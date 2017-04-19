# TrailSec Web UI

Web Application enables realtime monitoring of location data sent by security guards via TrailSec Device & App. Powered by [Vue.js](https://vuejs.org/), [Google Maps SDK](https://www.npmjs.com/package/google-maps) & [Firebase](https://firebase.google.com/).

<p align="center">
  <img src="https://raw.githubusercontent.com/TrailSec/TrailSec-WebUI/master/readme/screenshot.png">
</p>

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://docs.npmjs.com/getting-started/installing-node)
- [Yarn](https://yarnpkg.com/en/docs/install#mac-tab) (optional, alternative to npm)

## Installation

``` bash
git clone https://github.com/tohjustin/webUI.git
cd ./webUI
npm install # you can use "yarn" instead
```

## Getting Started

``` bash
# serve with gulp & browser-sync at localhost:3000
npm run dev

# deploy app on *firebase hosting* (staging server)
npm run deploy_staging

# deploy app on *firebase hosting* (production server)
npm run deploy_production
```
### **\*\*Additional Notes\*\***
- Configure your firebase projects used for **staging** & **production** in [.firebaserc](https://github.com/TrailSec/TrailSec-WebUI/blob/master/.firebaserc)
- Remember to update hard-coded values such as [Google API Key](https://github.com/TrailSec/TrailSec-WebUI/blob/master/app/js/google-maps-helper.js#L13-14) & [Firebase Database URL](https://github.com/TrailSec/TrailSec-WebUI/blob/master/app/js/app.js#L150-L151)
- Refer to exported JSON file ([cpen391-trailsec-export.json](https://github.com/TrailSec/TrailSec-WebUI/blob/master/db/cpen391-trailsec-export.json)) to see how the database is being structured on Firebase
