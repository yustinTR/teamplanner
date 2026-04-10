import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/dashboard/", "/matches/", "/team/", "/events/", "/profile/", "/trainingen/", "/create-team/"],
      },
    ],
    sitemap: "https://www.myteamplanner.nl/sitemap.xml",
  };
}
