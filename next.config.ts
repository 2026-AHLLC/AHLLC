import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  experimental: {
    serverActions: {
      // Allows multipart Server Action requests with enough overhead
      // for application-level file uploads up to 25 MB.
      bodySizeLimit: "27mb",
    },
  },
};

export default nextConfig;