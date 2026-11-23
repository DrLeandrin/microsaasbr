import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "O primeiro fluxo no n8n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title="O primeiro fluxo" kicker="15 minutos com um template real" />, size);
}
