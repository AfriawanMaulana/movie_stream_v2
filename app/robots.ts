import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth", "/profile", "/api"],
    },
    sitemap: "https://terflix.web.id/sitemap.xml",
  };
}
