/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Remove powered-by header for security
  poweredByHeader: false,

  // Strict mode for better error catching
  reactStrictMode: true,

  // TypeScript and ESLint behavior during builds
  typescript: {
    // !!  WARN:  Dangerously allow production builds even with type errors
    // Remove this in production or fix all type errors first
    ignoreBuildErrors: false, // Set to true only if you have type errors you'll fix later
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Environment variables exposed to browser (must start with NEXT_PUBLIC_)
  env: {
    CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
  },
};

module.exports = nextConfig;
