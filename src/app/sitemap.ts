import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { CATEGORIES, INTEGRATIONS } from "@/lib/catalog";
import { siteUrl } from "@/lib/config";
import { listPublished } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = siteUrl();
  const templates = await listPublished();
  const integrations = new Set(INTEGRATIONS.map((item) => item.slug));
  for (const template of templates) {
    for (const integration of template.integrations) integrations.add(integration.slug);
  }
  const now = new Date();
  return [
    { url: base, lastModified: now },
    { url: `${base}/enviar`, lastModified: now },
    { url: `${base}/patrocinar`, lastModified: now },
    ...CATEGORIES.map((category) => ({ url: `${base}/categoria/${category.slug}`, lastModified: now })),
    ...[...integrations].map((slug) => ({ url: `${base}/integracao/${slug}`, lastModified: now })),
    ...templates.map((template) => ({
      url: `${base}/t/${template.slug}`,
      lastModified: template.sourceDate || template.addedAt,
    })),
  ];
}
