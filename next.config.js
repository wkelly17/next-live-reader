/** @type {import('next').NextConfig} */
// const runtimeCaching = require('next-pwa/cache');
const runtimeCaching = require("./src/cache");

// module.exports = withPWA({
//   pwa: {
//     dest: "public",
//     runtimeCaching: runtimeCaching,
//   },
// });
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching: runtimeCaching,

  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});
module.exports = withPWA({
  experimental: {
    runtime: "experimental-edge",
  },
  // next.js config
});
