const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  // Tránh build Vercel fail vì khác phiên bản eslint/plugin so với máy local
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
