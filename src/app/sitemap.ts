import type { MetadataRoute } from "next";
import { getAllTees } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];

  // /compare, /cart and /checkout/success are excluded — personalised,
  // localStorage-driven pages with no server-rendered content for a
  // crawler to index. /terms, /privacy and /returns are excluded while
  // they're still drafts with [bracketed placeholders] instead of real
  // company details — add them back once finalised (see their noindex
  // metadata, which should come out at the same time).
  const teePages: MetadataRoute.Sitemap = getAllTees().map((tee) => ({
    url: `${SITE_URL}/tees/${tee.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...teePages];
}
