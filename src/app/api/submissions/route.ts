import { json, readJson } from "@/lib/http";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/errors";
import { parseSubmission } from "@/lib/validators";
import { insertSubmission } from "@/lib/writes";

export async function POST(request: Request) {
  if (!rateLimit(`submit:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return json({ error: "Muitos envios. Espere um pouco e tente de novo." }, 429);
  }
  const parsed = parseSubmission(await readJson(request));
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  if (parsed.spam) return json({ ok: true, message: "Recebemos. Vamos revisar antes de publicar." });
  try {
    const saved = await insertSubmission(parsed.value);
    if (saved.limited) return json({ error: "Muitos envios com esse e-mail. Espere um pouco." }, 429);
    return json({ ok: true, id: saved.id, message: "Recebemos. Vamos revisar antes de publicar." });
  } catch (error) {
    await logError(error, "/api/submissions");
    return json({ error: "Não deu para salvar agora." }, 500);
  }
}
