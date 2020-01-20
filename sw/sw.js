// Service Worker loader / interface
(() => {

  function registered(registration) {
    console.log('ServiceWorker registration successful', registration);
  }

  function gotErr(err) {
    console.log('ServiceWorker registration failed: ', err);
  }

  if ( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register('sw/worker.js').then(registered).catch(gotErr);
  }

})();