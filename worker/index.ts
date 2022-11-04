declare let self: ServiceWorkerGlobalScope;

self.addToCacheAsync = async function addToCacheAsync(
  cacheName: string,
  request: Request,
  checkForExistingResponse: boolean = false
) {
  console.log("ADD TO CACHE ASYNC");
  const cache = await caches.open(cacheName);
  if (!cache) return;
  if (checkForExistingResponse) {
    const matchedResponse = await cache.match(request);
    if (!matchedResponse) return;
  }
  if (cache) {
    cache.add(request);
  }
};
self.getReqWithoutQueryString = function getReqWithoutQueryString(url: string) {
  let cleanUrl = new URL(url);
  cleanUrl.search = "";
  const reqWithoutQueryString = new Request(cleanUrl);
  return reqWithoutQueryString;
};

// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging // To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true // Simply create a worker/index.ts and start implementing your service worker. next-pwa will detect this file automatically, and bundle the file into dest as worker-*.js using webpack. It's also automatically injected into sw.js generated.
//
// self.__WB_DISABLE_DEV_LOGS = true

// listen to message event from window
// self.addEventListener('message', (event) => {
//   // HOW TO TEST THIS?
//   // Run this in your browser console:
//   //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
//   // OR use next-pwa injected workbox object
//   //     window.workbox.messageSW({command: 'log', message: 'hello world'})
//   console.log(event?.data);
// });
// self.addEventListener('activate', (event) => {
//   if (!event) return;
//   debugger;
//   console.log('ACTIVATING CUSTOM WORKER');
//   event.waitUntil(
//     (async function () {
//       const cacheNames = await caches.keys();
//       await Promise.all(
//         cacheNames
//           .filter((cacheName) => {
//             console.log('cache name from activation');
//             console.log(cacheName);
//             return false;
//             // Return true if you want to remove this cache,
//             // but remember that caches are shared across
//             // the whole origin
//           })
//           .map((cacheName) => caches.delete(cacheName))
//       );
//     })()
//   );
// });

// self.addEventListener('push', (event) => {
//   // @ts-ignore:
//   const data = JSON.parse(event?.data?.text() || '{}');
//   event?.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.message,
//       icon: '/icons/android-chrome-192x192.png',
//     })
//   );
// });
// self.addEventListener("fetch", (event: any) => {
//   function handleIntercept(event: any) {
//     console.log(event.request);

//     return fetch(event.request);
//   }
//   event.respondWith(
//     // magic goes here
//     handleIntercept(event)
//   );
// });

self.addEventListener("notificationclick", (event: any) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});
export {};
