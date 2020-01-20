(() => {
  console.log('hi from worker.js');

  var urlsToCache = [
    'index.html',
    '.',
  ];

  // self.addEventListener( 'activate', function( event ){
  //   event.waitUntil(
  //     caches.open( 'container_name' )
  //       .then( function( cache ) {
  //         return cache.addAll( urlsToCache );
  //       })


  // self.addEventListener( 'fetch', function( event ) {
    // event.respondWith(
      // caches.match( event.request )
      // .then(function( response ) {
      //   if ( response ) {
      //     return response;
        // }
        // return fetch( event.request );

        // return caches.open( 'name_your_cache_container' )
        //       .then( function( cache ) {
        //         cache.put( event.request, resp.clone( ));
        //         return resp;
        //       });
        //   });
})();