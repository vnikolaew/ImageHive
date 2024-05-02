import { withSentryConfig } from "@sentry/nextjs";


/** @type {import('next').NextConfig} */
const nextConfig = {
   sentry:{
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
   },
   experimental: {
   },
   images: {
      remotePatterns: [
         {
            hostname: 'lh3.googleusercontent.com',
            protocol: `https`,
         },
         {
            hostname: 'randomuser.me',
            protocol: `https`,
         },
         {
            hostname: 'cdn.pixabay.com',
            protocol: `https`,
         },
         {
            hostname: 'pixabay.com',
            protocol: `https`,
         },
         {
            hostname: 'files.stripe.com',
            protocol: `https`,
         },
      ]
   }
};

const sentryWebpackPluginOptions = {
   // Additional config options for the Sentry webpack plugin. Keep in mind that
   // the following options are set automatically, and overriding them is not
   // recommended:
   //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

   org: "smartsoft-7h",
   project: "javascript-nextjs",

   // An auth token is required for uploading source maps.
   authToken: process.env.SENTRY_AUTH_TOKEN,

   silent: true, // Suppresses all logs

   // For all available options, see:
   // https://github.com/getsentry/sentry-webpack-plugin#options.
};

export default nextConfig;
