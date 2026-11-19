import { json, readJson, withAdmin } from "@/lib/http";
import { itemsFromSeedBody } from "@/lib/seed-document";
import { parseTemplateWrite } from "@/lib/validators";
import { upsertTemplates } from "@/lib/writes";

export async function POST(request: Request) {
  return withAdmin(request, "/api/admin/entries", async () => {
    const items = itemsFromSeedBody(await readJson(request));
    if (items.length === 0) return json({ error: "Envie templates e, se quiser, paid." }, 400);
    if (items.length > 300) return json({ error: "No máximo 300 itens por vez." }, 400);
    const parsed = items.map((item, index) => parseTemplateWrite(item, index));
    const errors = parsed.flatMap((result) => (result.ok ? [] : [result.error]));
    if (errors.length > 0) return json({ error: "Há itens inválidos.", errors }, 400);
    const values = parsed.flatMap((result) => (result.ok ? [result.value] : []));
    const saved = await upsertTemplates(values);
    return json({
      ok: true,
      upserted: saved.length,
      listed: values.filter((item) => item.published && item.listed).length,
      slugs: saved.map((item) => item.slug),
    });
  });
}
