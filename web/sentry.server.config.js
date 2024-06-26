import * as Sentry from "@sentry/nextjs";

Sentry.init({
   dsn: "https://c5539d7c6c8f552923d451cec6b5d718@o4507147804147712.ingest.de.sentry.io/4507147806703696",

   // Set tracesSampleRate to 1.0 to capture 100%
   // of transactions for performance monitoring.
   // We recommend adjusting this value in production
   tracesSampleRate: 1.0,

   // ...

   // Note: if you want to override the automatic release value, do not set a
   // `release` value here - use the environment variable `SENTRY_RELEASE`, so
   // that it will also get attached to your source maps
});
