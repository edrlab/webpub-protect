const _cacheBuster = '__CACHE_BUSTER__';

self.addEventListener('install', (evt) => {
  console.log('_SW install', evt);
  evt.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (evt) => {
  console.log('_SW activate', evt);
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then((clientList) => {
      var urls = clientList.map((client) => {
        return client.url;
      });
      console.log('_SW clients:', urls);
    });

  evt.waitUntil(self.clients.claim());
});
self.addEventListener('message', (evt) => {
  console.log('_SW message', evt.data);
  evt.source.postMessage('_SW says hello! ==> ' + evt.data);
});

self.addEventListener('fetch', (evt) => {
  console.log('_SW fetch', evt.request);
  if (evt.request.method != 'GET') {
    return;
  }

  const url = new URL(evt.request.url);
  if (
    !url.pathname.endsWith('.png') &&
    !url.pathname.endsWith('.jpg') &&
    !url.pathname.endsWith('.jpeg') &&
    !url.pathname.endsWith('.gif')
  ) {
    console.log('_SW fetch bypass: ', url.pathname);
    return;
  }

  console.log('_SW fetch intercept: ', url.pathname);

  let req = evt.request.clone();
  if (url.pathname.endsWith('edrlab.png')) {
    url.pathname = url.pathname.replace('/edrlab.png', '/edrlab_ok.png');

    req = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      mode: 'same-origin', // otherwise, 'navigate'
      credentials: req.credentials, // cookies, etc.
      redirect: 'manual', // req.redirect
      cache: req.cache,
      referrer: req.referrer,
    });
    console.log('_SW fetch intercept IMAGE: ', url.pathname, url.toString());
  }
  evt.respondWith(
    fetch(req).then((response) => {
      return response;
    }),
  );
  // if (event.request.url.includes('/version')) {
  //   event.respondWith(new Response(version, {
  //     headers: {
  //       'content-type': 'text/plain'
  //     }
  //   }));
  // }
});

// self.addEventListener('fetch', (event) => {
//   event.waitUntil(async () => {
//     if (!event.clientId) return;
//     const client = await clients.get(event.clientId);
//     if (!client) return;

//     client.postMessage({
//       msg: 'Hey I just got a fetch from you!',
//       url: event.request.url,
//     });
//   });
// });
