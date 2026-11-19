import { siteUrl } from "@/lib/config";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export type NewsletterPick = {
  title: string;
  description: string;
  slug: string;
};

export function renderNewsletter(input: {
  picks: NewsletterPick[];
  sponsorLine?: string | null;
  siteUrl?: string;
  issuedAt?: Date;
}) {
  const base = (input.siteUrl || siteUrl()).replace(/\/$/, "");
  const picks = input.picks.slice(0, 5);
  const issued = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(input.issuedAt ?? new Date());
  const items =
    picks.length === 0
      ? `<p style="margin:0;font-size:16px;line-height:1.5;color:#243140;">Nenhum template novo nesta edição.</p>`
      : picks
          .map((pick) => {
            const href = `${base}/t/${encodeURIComponent(pick.slug)}`;
            return `<p style="margin:0 0 14px;font-size:16px;line-height:1.45;color:#14202b;"><a href="${href}" style="color:#0c5c57;font-weight:700;text-decoration:underline;">${escapeHtml(pick.title)}</a> — ${escapeHtml(pick.description)}</p>`;
          })
          .join("");
  const sponsor = input.sponsorLine?.trim()
    ? escapeHtml(input.sponsorLine.trim())
    : "vaga aberta";

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f3f1ea;">
    <div style="display:none;max-height:0;overflow:hidden;">Toda terça, 5 automações n8n para negócios brasileiros.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ea;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf8;border:1px solid #ddd4c4;border-radius:16px;">
            <tr>
              <td style="padding:28px 28px 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#14202b;">n8n Brasil</td>
            </tr>
            <tr>
              <td style="padding:0 28px 8px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#4a524b;">${escapeHtml(issued)}</td>
            </tr>
            <tr>
              <td style="padding:8px 28px 20px;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#243140;">Toda terça, as 5 melhores automações n8n novas para negócios brasileiros.</td>
            </tr>
            <tr>
              <td style="padding:0 28px 8px;font-family:Arial,sans-serif;">${items}</td>
            </tr>
            <tr>
              <td style="padding:8px 28px 20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#243140;">Patrocinado por ${sponsor}</td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#4a524b;">
                Diretório independente. Não somos afiliados à n8n GmbH.<br />
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#0c5c57;">Cancelar inscrição</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
