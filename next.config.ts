import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The project ships first-party SVG placeholders in /public/placeholder.
    // These are trusted, local assets; the CSP below keeps them sandboxed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
