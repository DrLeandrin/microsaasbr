import { logError } from "@/lib/errors";
import { escapeHtml } from "@/lib/newsletter";
import { json, readJson } from "@/lib/http";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyOwner } from "@/lib/resend";
import { parseInquiry } from "@/lib/validators";
import { insertInquiry } from "@/lib/writes";

export async function POST(request: Request) {
  if (!rateLimit(`inquiry:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return json({ error: "Muitas mensagens. Espere um pouco e tente de novo." }, 429);
  }
  const parsed = parseInquiry(await readJson(request));
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  if (parsed.spam) return json({ ok: true, message: "Recebemos. Respondemos por e-mail." });
  try {
    const saved = await insertInquiry(parsed.value);
    if (saved.limited) return json({ error: "Muitas mensagens com esse e-mail. Espere um pouco." }, 429);
    try {
      await notifyOwner(
        `Anúncio n8n Brasil: ${parsed.value.plan}`,
        `<p><strong>${escapeHtml(parsed.value.name)}</strong> (${escapeHtml(parsed.value.email)})</p><p>Plano: ${escapeHtml(parsed.value.plan)}</p><p>${escapeHtml(parsed.value.message)}</p>`,
      );
    } catch (error) {
      await logError(error, "/api/sponsor-inquiries");
    }
    return json({ ok: true, id: saved.id, message: "Recebemos. Respondemos por e-mail." });
  } catch (error) {
    await logError(error, "/api/sponsor-inquiries");
    return json({ error: "Não deu para salvar agora." }, 500);
  }
}
