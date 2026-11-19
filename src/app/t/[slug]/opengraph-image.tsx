import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";
import { getPublishedBySlug } from "@/lib/queries";

export const alt = "Template no n8n Brasil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TemplateOpenGraph({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await getPublishedBySlug(slug).catch(() => null);
  return new ImageResponse(
    <OgCard title={template?.title ?? "Template n8n"} kicker={template?.description ?? "Automação para negócios brasileiros"} />,
    size,
  );
}
