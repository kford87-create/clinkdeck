import type { MetadataRoute } from "next";
import { prisma } from "@/app/lib/prisma";

// Regenerate sitemap once an hour so newly-published listings surface
// in Google Search without waiting for a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL ?? "https://www.clinkdeck.com";

  const [listings, users] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { onboarded: true },
      select: { handle: true, createdAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${baseUrl}/l/${l.slug}`,
    lastModified: l.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const creatorPages: MetadataRoute.Sitemap = users.map((u) => ({
    url: `${baseUrl}/c/${u.handle}`,
    lastModified: u.createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...listingPages, ...creatorPages];
}
