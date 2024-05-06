//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");

/**
 * @type {import("@nx/next/plugins/with-nx").WithNxOptions}
 **/
const nextConfig = {
   output: `standalone`,
   nx: {
      // Set this to true if you would like to use SVGR
      // See: https://github.com/gregberge/svgr
      svgr: false,

   },
   typescript: {
      ignoreBuildErrors: true,
   },
   sentry: {
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
   },
   experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
   },
   webpack: (config) => {
      // See https://webpack.js.org/configuration/resolve/#resolvealias
      config.resolve.alias = {
         ...config.resolve.alias,
         "sharp$": false,
         "onnxruntime-node$": false,
      };
      return config;
   },
   images: {
      remotePatterns: [
         {
            hostname: "lh3.googleusercontent.com",
            protocol: `https`,
         },
         {
            hostname: "randomuser.me",
            protocol: `https`,
         },
         {
            hostname: "cdn.{APP_NAME}.com",
            protocol: `https`,
         },
         {
            hostname: "{APP_NAME}.com",
            protocol: `https`,
         },
         {
            hostname: "files.stripe.com",
            protocol: `https`,
         },
         {
            hostname: "live.staticflickr.com",
            protocol: `https`,
         },
         {
            hostname: "staticflickr.com",
            protocol: `https`,
         },
      ],
   },
};

const plugins = [
   // Add more Next.js plugins to this list if needed.
   withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
