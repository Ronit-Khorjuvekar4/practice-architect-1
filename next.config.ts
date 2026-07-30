import type { NextConfig } from "next";

const strapiOrigin =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const { protocol, hostname, port } = new URL(strapiOrigin);
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    qualities: [75, 85],
    dangerouslyAllowLocalIP: isDevelopment,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",

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