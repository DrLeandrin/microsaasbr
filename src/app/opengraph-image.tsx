import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "n8n Brasil — automações para negócios brasileiros";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<OgCard title="n8n Brasil" kicker="Automações para negócios brasileiros" />, size);
}
