// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");
const { resolve } = require("path");

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
   experimental: {
      serverComponentsExternalPackages: [`uuid`, 'langchain', '@langchain/core', ],
   },
   typescript: {
      ignoreBuildErrors: true,
   },
   sentry: {
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
   },
   // experimental: {
   //    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
   // },
   webpack: (config) => {
      // See https://webpack.js.org/configuration/resolve/#resolvealias
      config.externals = [...config.externals, "hnswlib-node"];
      //
      config.resolve.alias = {
         ...config.resolve.alias,
         "sharp$": false,
         "onnxruntime-node$": false,
         // uuid: resolve(__dirname, 'node_modules/uuid/dist/esm-node/index.js')
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
         {
            hostname: "cdn.pixabay.com",
            protocol: `https`,
         },
         {
            hostname: "www.dropbox.com",
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
