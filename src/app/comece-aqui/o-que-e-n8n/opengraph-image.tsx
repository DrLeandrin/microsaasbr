import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "O que é n8n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title="O que é n8n" kicker="Comece aqui" />, size);
}
