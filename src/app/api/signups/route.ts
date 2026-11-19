import { logError } from "@/lib/errors";
import { json, readJson } from "@/lib/http";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { addToAudience } from "@/lib/resend";
import { parseSignup } from "@/lib/validators";
import { insertSignup, markSignupSynced } from "@/lib/writes";

export async function POST(request: Request) {
  if (!rateLimit(`signup:${clientIp(request)}`, 8, 60 * 60 * 1000)) {
    return json({ error: "Muitas tentativas. Espere um pouco e tente de novo." }, 429);
  }
  const parsed = parseSignup(await readJson(request));
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  if (parsed.spam) return json({ ok: true, message: "Pronto. Terça que vem as 5 automações chegam nesse e-mail." });
  try {
    const saved = await insertSignup(parsed.email);
    if (!saved.already) {
      try {
        const audience = await addToAudience(parsed.email);
        if (!audience.skipped) await markSignupSynced(parsed.email, audience.id);
      } catch (error) {
        await logError(error, "/api/signups");
      }
    }
    return json({
      ok: true,
      message: saved.already
        ? "Esse e-mail já está na lista."
        : "Pronto. Terça que vem as 5 automações chegam nesse e-mail.",
    });
  } catch (error) {
    await logError(error, "/api/signups");
    return json({ error: "Não deu para salvar agora." }, 500);
  }
}
