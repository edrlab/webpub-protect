/* eslint-disable no-prototype-builtins */

// to programmatically unregister SWs:
// navigator.serviceWorker.getRegistrations().then((registrations) => {
//   for (let registration of registrations) {
//     registration.unregister();
//   }
// });
// navigator.serviceWorker.getRegistrations().then((registrations) => { for (let registration of registrations) { registration.unregister(); } });

console.log(`INJECT SW: ${document.readyState}`);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {
      scope: '/protect/content/',
    })
    .then((registration) => {
      console.log('SW register ok:', registration);
      return navigator.serviceWorker.ready;
    })
    .then((registration) => {
      console.log('SW register ready', registration);
      registration.active.postMessage('msg1 from client');
      if (navigator.serviceWorker.controller) {
        console.log('SW register controlled (at registration ready)');
        navigator.serviceWorker.controller.postMessage('msg2 from client');
      }
    })
    .catch((error) => {
      console.log('SW register fail:', error);
    });
  navigator.serviceWorker.addEventListener('controllerchange', (evt) => {
    console.log('SW controllerchange:', evt);
    if (navigator.serviceWorker.controller) {
      console.log('SW register controlled (at controllerchange)');
      navigator.serviceWorker.controller.postMessage('msg3 from client');
    }
  });
  navigator.serviceWorker.addEventListener('message', (evt) => {
    console.log('SW message:', evt.data);
  });
}
