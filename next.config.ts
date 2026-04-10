import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "myteamplanner.nl" }],
        destination: "https://www.myteamplanner.nl/:path*",
        permanent: true,
      },
    ];
  },
};

export default withSerwist(nextConfig);
