import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the X-Powered-By: Next.js header (security hardening)
  poweredByHeader: false,

  // Re-enable Strict Mode; Leaflet must be loaded via dynamic import with ssr:false
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.basemaps.cartocdn.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
              "font-src 'self' https://fonts.gstatic.com https://unpkg.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://*.basemaps.cartocdn.com https://*.openstreetmap.org https://nominatim.openstreetmap.org https://unpkg.com",
              "connect-src 'self' blob: https://generativelanguage.googleapis.com https://nominatim.openstreetmap.org",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
