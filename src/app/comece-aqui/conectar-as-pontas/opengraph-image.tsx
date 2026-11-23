import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Conectar WhatsApp, Pix e Bling no n8n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title="Conectar as pontas" kicker="Webhook, API e credencial" />, size);
}
