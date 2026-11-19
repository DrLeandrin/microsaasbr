import { categoryBySlug } from "@/lib/catalog";
import { json, readJson, withAdmin } from "@/lib/http";
import { listSponsorWeeks } from "@/lib/queries";
import { cleanText, httpUrl } from "@/lib/validators";
import { slugify } from "@/lib/slug";
import { insertSponsor } from "@/lib/writes";

export async function GET(request: Request) {
  return withAdmin(request, "/api/admin/sponsors", async () => json({ sponsors: await listSponsorWeeks() }));
}

export async function POST(request: Request) {
  return withAdmin(request, "/api/admin/sponsors", async () => {
    const body = (await readJson(request)) as Record<string, unknown> | null;
    if (!body) return json({ error: "JSON inválido." }, 400);
    const name = cleanText(body.name, 120);
    const slug = slugify(typeof body.slug === "string" && body.slug.trim() ? body.slug : name);
    const url = httpUrl(body.url);
    const barText = cleanText(body.barText ?? body.bar_text, 180);
    const startsOn = typeof body.startsOn === "string" ? body.startsOn : typeof body.starts_on === "string" ? body.starts_on : "";
    const endsOn = typeof body.endsOn === "string" ? body.endsOn : typeof body.ends_on === "string" ? body.ends_on : "";
    const slot = body.slot === "destaque" ? "destaque" : body.slot === "semana" ? "semana" : "";
    const categoryInput = typeof body.categorySlug === "string" ? body.categorySlug : typeof body.category_slug === "string" ? body.category_slug : "";
    const category = categoryInput ? categoryBySlug(categoryInput) : null;
    if (!name || !slug || !url || !barText || !/^\d{4}-\d{2}-\d{2}$/.test(startsOn) || !/^\d{4}-\d{2}-\d{2}$/.test(endsOn) || !slot) {
      return json({ error: "Informe name, url, barText, startsOn, endsOn e slot (semana ou destaque)." }, 400);
    }
    if (categoryInput && !category) return json({ error: "Categoria do destaque não existe." }, 400);
    if (startsOn > endsOn) return json({ error: "A data final vem antes da inicial." }, 400);
    const saved = await insertSponsor({
      slug,
      name,
      url,
      barText,
      startsOn,
      endsOn,
      newsletterLine: cleanText(body.newsletterLine ?? body.newsletter_line, 160) || null,
      slot,
      categorySlug: category?.slug ?? null,
    });
    return json({ sponsor: saved });
  });
}
