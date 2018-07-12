/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'webkonquest-cache',
  queryOptions: {
    ignoreSearch: true
  }
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    './assets/imgs/backgrounds/home-background-848x600.png',
    './assets/imgs/backgrounds/play-background.png',
    './assets/imgs/planets/planet-beige.png',
    './assets/imgs/planets/planet-blue.png',
    './assets/imgs/planets/planet-cyan.png',
    './assets/imgs/planets/planet-green.png',
    './assets/imgs/planets/planet-grey.png',
    './assets/imgs/planets/planet-lime.png',
    './assets/imgs/planets/planet-navy.png',
    './assets/imgs/planets/planet-orange.png',
    './assets/imgs/planets/planet-pink.png',
    './assets/imgs/planets/planet-red.png',
    './assets/imgs/planets/planet-yellow.png',
    './assets/fonts/ionicons.woff2?v=4.1.1',
    './assets/fonts/roboto-medium.woff2',
    './assets/fonts/roboto-regular.woff2',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.cacheFirst);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;
