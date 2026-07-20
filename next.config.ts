import type { NextConfig } from "next";

/**
 * Strapi origin, derived from the same env var the app uses at runtime.
 * Deriving the image host from the env var means migrating Strapi to a VPS
 * only requires editing `.env.local` — this file needs no change.
 */
const strapiOrigin =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const { protocol, hostname, port } = new URL(strapiOrigin);
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 only allows quality 75 by default. The project gallery
    // intentionally requests 85 for full-size architectural imagery.
    qualities: [75, 85],
    // Local Strapi resolves to a private IP. Permit that optimizer request in
    // development only; production keeps Next.js' private-network protection.
    dangerouslyAllowLocalIP: isDevelopment,
    // First-party SVG placeholders in /public/placeholder are trusted, local
    // assets; the CSP below keeps them sandboxed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow next/image to optimise media uploaded to Strapi (the default
    // upload provider serves files from `/uploads/**`).
    remotePatterns: [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
