/** Product name lives in one place so a later rename is a single edit. */
export const SITE_NAME = "n8n Brasil";

export const SITE_DESCRIPTION =
  "Diretório de templates n8n para WhatsApp, Pix, nota fiscal e a rotina de negócios no Brasil.";

export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const DISCLAIMER =
  "Diretório independente da comunidade. Não somos afiliados à n8n GmbH.";

export const NEWSLETTER_PITCH =
  "Toda terça, as 5 melhores automações n8n novas para negócios brasileiros.";

export const PRICE_WEEK = "R$ 150/semana";
export const PRICE_FEATURE = "R$ 49/mês";
