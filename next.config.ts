import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.basemaps.cartocdn.com" },
    ],
  },
  // Suppress hydration mismatch warnings for Leaflet
  reactStrictMode: false,
};

export default nextConfig;
