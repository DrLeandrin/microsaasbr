import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Comece aqui no n8n Brasil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title="Comece aqui" kicker="n8n para quem nunca usou" />, size);
}
