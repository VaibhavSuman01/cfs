import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";
import {
  PUBLIC_SITEMAP_PATHS,
  sitemapPriorityForPath,
  sitemapChangeFrequency,
} from "@/lib/seo-pages";

const baseUrl = getBaseUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_SITEMAP_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: sitemapChangeFrequency(path),
    priority: sitemapPriorityForPath(path),
  }));
}
