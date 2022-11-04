"use strict";

const cache = require("next-pwa/cache");

// Workbox RuntimeCaching config: https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.RuntimeCachingEntry

const runTimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts-webfonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "google-fonts-stylesheets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-font-assets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-image",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:mp3|wav|ogg)$/i,
    handler: "CacheFirst",
    options: {
      rangeRequests: true,
      cacheName: "static-audio-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:mp4)$/i,
    handler: "CacheFirst",
    options: {
      rangeRequests: true,
      cacheName: "static-video-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-js-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-style-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  //! ORIGINAL NEXT JSON, WITH MODIFIED URL PATTERN
  // {
  //   urlPattern: /\/_next\/data\/.+\/.+\.json\?{0,1}.*/i,
  //   handler: "StaleWhileRevalidate",
  //   options: {
  //     cacheName: "next-data-test",
  //     expiration: {
  //       maxEntries: 32,
  //       maxAgeSeconds: 24 * 60 * 60, // 24 hours
  //     },
  //   },
  // },
  {
    urlPattern: /\/_next\/data\/.*\/.*\.json\?{0,1}.*/i,
    // handler: "StaleWhileRevalidate",
    handler: async ({ url, request, event, params }) => {
      // NETWORK -> return network and update cache if it exists in html version -> check for json fallback -> offline fallback
      console.log("JSON REQUEST = zzz");
      console.log(url, request, event, params);
      const purpose = request.headers.get("purpose");
      console.log({ purpose });
      let correspondingPagePath = url.pathname
        .split("/")
        .slice(4, 7)
        .join("/")
        .replace(".json", "");
      correspondingPagePath = "/" + correspondingPagePath;

      // we don't want to save slug or other params as part of the json requests;
      const reqWithoutQueryString = getReqWithoutQueryString(request.url);
      console.log({ reqWithoutQueryString });

      // check the HTML cache
      const htmlPageCache = await caches.open("others-test1");
      const pageCacheKeys = await htmlPageCache.keys();
      // keys are an array of req objects: we can check the req.url for a matching substring;
      const matchingRequest = pageCacheKeys.find((key) =>
        key.url?.includes(correspondingPagePath)
      );
      console.log({ matchingRequest });

      let response;
      // NETWORK FIRST,
      // todo:  Network first, fallback, and if saved in html paths, update this JSON version if the network fetch was successful
      //@ NETWORK FIRST
      try {
        response = await fetch(request);
        if (response.ok) {
          // there is a matching html page that has been cached on demand, then cache this json route too;
          if (matchingRequest) {
            addToCacheAsync("next-data-custom", reqWithoutQueryString);
          }
        }
      } catch (error) {
        // @ NETWORK REQ FAILED
        // @ CHECK FOR CACHED FALLBACK
        console.error(error);
        {
          // will search all caches for this json route
          const matchingJsonRes = await caches.match(reqWithoutQueryString, {
            cacheName: "next-data-custom",
          });
          if (matchingJsonRes) {
            response = matchingJsonRes;
            const clone = response.clone();
            let matchingJsonSaved = await clone.json();
            console.log({ matchingJsonSaved });
            return response;
          }
        }
      }
      if (!response) {
        // @ NETWORK FAILED, AND NO MATCHING CACHE
        console.log(
          "network failed; NO matching cached json.  fallback to offline page"
        );
        let allCacheKeys = await caches.keys();
        let offLinePage;
        for (let i = 0; i < allCacheKeys.length; i++) {
          const cache = await caches.open(allCacheKeys[i]);
          const cacheReqs = await cache.keys();
          console.log({ cacheReqs });

          const offLinePageSearch = cacheReqs.find((req) =>
            req.url.includes("/_offline")
          );
          if (offLinePageSearch) {
            offLinePage = await cache.match(offLinePageSearch);
            console.log({ offLinePage });
            break;
          } else continue;
        }

        // todo: I should save this offline page somewhere else as well;
        return offLinePage;
      }
      return response;
    },
    options: {
      cacheName: "next-data-custom",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "static-data-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      if (!isSameOrigin) return false;
      const pathname = url.pathname;
      // Exclude /api/auth/callback/* to fix OAuth workflow in Safari without impact other environment
      // Above route is default for next-auth, you may need to change it if your OAuth workflow has a different callback route
      // Issue: https://github.com/shadowwalker/next-pwa/issues/131#issuecomment-821894809
      if (pathname.startsWith("/api/auth/")) return false;
      if (pathname.startsWith("/api/")) return true;
      return false;
    },
    handler: "NetworkFirst",
    method: "GET",
    options: {
      cacheName: "apis",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
    },
  },
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      if (!isSameOrigin) return false;
      const pathname = url.pathname;
      if (pathname.startsWith("/api/")) return false;
      return true;
    },
    // handler: "NetworkFirst",
    handler: async ({ url, request, event, params }) => {
      // OVERALL STRATEGY, Network first, revalidate when network succeeds, fallback to a cached version if exists, and offline if none of above; :  PREFER CACHED VERSION, BUT CHECK TO SEE IF THERE IS ANYTHING NEWER;  IF SO, UPDATE THE CACHE.  IF NOT, NO WORRIES; WE HAVE A PREV. CACHED VERSION, AND THAT WILL BE HANDED TO THEM ONCE THEY ARE BACK ONLINE?
      // https://jakearchibald.com/2014/offline-cookbook/#on-user-interaction

      console.log("ze function handler? xxx");

      //Is this a request to save a route?
      let isSaveReq = request.headers.get("x-save-request") == "true";
      console.log(...request.headers);

      // Avoid saving query string as part of request;
      let reqToUse = request; //don't pass along saved header if present;

      // if (isSaveReq) {
      //   let noQuerySearchUrl = new URL(url);
      //   noQuerySearchUrl.search = "";
      //   const newReq = new Request(noQuerySearchUrl);
      //   reqToUse = newReq;
      // }

      const cache = await caches.open("others-test1");
      let networkResponse;
      try {
        networkResponse = await fetch(reqToUse);
        if (networkResponse.ok) {
          let debugClone = networkResponse.clone();
          let responseBody = debugClone.text(); //debugging for me; We don't have to consume this body;
          console.log({ responseBody });
          if (isSaveReq) {
            // no need to await this response: not used immediately
            cache.add(reqToUse);
          }
        }
      } catch (error) {
        // network error:
        console.error(error);
      }
      // ASYNC CHECKING TO UPDATE CACHE; Not waiting on this;
      addToCacheAsync("others-test1", reqToUse, true);
      // Send NETWORK ATTEMPT FIRST
      if (networkResponse) {
        return networkResponse;
      } else {
        const matchedResponse = await cache.match(request);
        if (matchedResponse) {
          return matchedResponse;
        } else {
          console.log("out of luck -- no network or cached version");
          let offlinePage = await caches.match("/_offline");
          console.log({ offlinePage });
          return Response.error();
        }
      }
    },
    options: {
      cacheName: "others-test1",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      // networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      return !isSameOrigin;
    },
    handler: "NetworkFirst",
    options: {
      cacheName: "cross-origin",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 60 * 60, // 1 hour
      },
      networkTimeoutSeconds: 10,
    },
  },
];

module.exports = runTimeCaching;
