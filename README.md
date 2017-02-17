# TrailSec Web UI

Monitor security guards’ location using Firebase's realtime database.

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
# serve with gulp & browser-sync at localhost:8080
npm run dev

# build for production with minification
npm run build

# deploy app to firebase hosting
npm run deploy
```

## Features To-do list

**General**
  - ~~Setup up static hosting on firebase~~
  - ~~Write npm scripts for quick deployment~~
  - **Create script to generate mock `check in` data (Last 7 days)**

**Google Maps SDK**
  - ~~Plot routes on map canvas with a given array of `{lat,long}` data~~
  - ~~Plot markers on map canvas with given `check in` data~~
  - **Add styling to the `infoWindow` (pops up when you hover the markers on the map)**
  - ~~Center the map on the marker when we click its corresponding entry on the sidebar-list~~

**Sidebar**
  - ~~Show all recent activity~~
  - ~~Add widgets on sidebar for user to select filter params~~
  - ~~Filter `check in` data by date, time & routes (user?)~~
  - ~~Style the datetime picker to fit the color theme~~

**Realtime Database (Firebase)**
  - ~~Create animation when marker is created~~
  - ~~Update sidebar list & markers when firebase has a 'push' event~~

**Possible Nice-to-Haves**
  - *[Send notifications when firebase has a 'push' event]*
  - *[When we click the marker, highlight the corresponding entry in list]*
  - *[Custom SVG markers]*
  - *[Generate mock 5~10 different routes around campus]*
  - *[Create generic function to draw routes stored on database]*
