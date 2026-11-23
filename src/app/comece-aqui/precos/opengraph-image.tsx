import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Quanto custa o n8n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title="Quanto custa" kicker="Preços conferidos em novembro de 2026" />, size);
}
