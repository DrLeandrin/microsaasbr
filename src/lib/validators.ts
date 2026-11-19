import {
  resolveCategory,
  resolveDifficulty,
  resolveIntegration,
  type DifficultySlug,
} from "@/lib/catalog";
import { emailBlockReason, normalizeEmail } from "@/lib/email";
import { slugify } from "@/lib/slug";

const MAX_JSON_BYTES = 500 * 1024;

export function todayInBrazil(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(now);
}

export function daysAgo(days: number, now = new Date()) {
  const copy = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(copy);
}

export function httpUrl(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2000) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanMultiline(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim().slice(0, max);
}

export function parseWorkflowJson(value: unknown): { ok: true; json: string } | { ok: false; error: string } {
  if (typeof value !== "string" || !value.trim()) {
    return { ok: false, error: "Envie o JSON exportado do n8n." };
  }
  if (Buffer.byteLength(value, "utf8") > MAX_JSON_BYTES) {
    return { ok: false, error: "O JSON passa de 500 KB." };
  }
  let data: unknown;
  try {
    data = JSON.parse(value);
  } catch {
    return { ok: false, error: "Esse arquivo não é um JSON válido." };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, error: "O JSON do fluxo precisa ser um objeto." };
  }
  const nodes = (data as { nodes?: unknown }).nodes;
  if (!Array.isArray(nodes)) {
    return { ok: false, error: "Não achei a lista de nodes. Exporte o workflow pelo n8n." };
  }
  return { ok: true, json: value };
}

export type IntegrationRef = { slug: string; name: string };

export function parseIntegrationList(value: unknown): IntegrationRef[] {
  const raw = Array.isArray(value)
    ? value.map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "name" in item && typeof item.name === "string") return item.name;
        return "";
      })
    : typeof value === "string"
      ? value.split(/[,;\n]/)
      : [];
  const refs: IntegrationRef[] = [];
  for (const item of raw) {
    const name = item.trim();
    if (!name) continue;
    const known = resolveIntegration(name);
    const slug = known?.slug ?? slugify(name);
    if (!slug || slug.length < 2 || refs.some((ref) => ref.slug === slug)) continue;
    refs.push({ slug, name });
    if (refs.length >= 12) break;
  }
  return refs;
}

export type TemplateWrite = {
  slug: string;
  title: string;
  description: string;
  explanation: string | null;
  integrations: IntegrationRef[];
  category: string;
  difficulty: DifficultySlug | null;
  difficultyNote: string | null;
  authorName: string | null;
  authorUrl: string | null;
  sourceUrl: string;
  sourceName: string | null;
  sourceDate: string | null;
  licenseNote: string | null;
  nodeCount: number | null;
  jsonDownloadable: boolean;
  hostedJson: string | null;
  price: string | null;
  priceAsShown: string | null;
  purchaseUrl: string | null;
  listed: boolean;
  addedAt: string;
  popularity: number;
  published: boolean;
};

export function parseTemplateWrite(input: unknown, index?: number): { ok: true; value: TemplateWrite } | { ok: false; error: string } {
  const prefix = index === undefined ? "" : `Item ${index + 1}: `;
  if (!input || typeof input !== "object") return { ok: false, error: `${prefix}objeto inválido.` };
  const row = input as Record<string, unknown>;
  const title = cleanText(row.title ?? row.name, 140);
  if (title.length < 3) return { ok: false, error: `${prefix}título curto demais.` };
  const slugSource = typeof row.slug === "string" && row.slug.trim() ? row.slug : title;
  const slug = slugify(slugSource);
  if (!slug) return { ok: false, error: `${prefix}slug inválido.` };
  const description = cleanText(row.description, 320);
  if (description.length < 8) return { ok: false, error: `${prefix}descrição curta demais.` };
  const explanationRaw = cleanMultiline(row.explanation, 8000);
  const category = resolveCategory(typeof row.category === "string" ? row.category : "");
  if (!category) return { ok: false, error: `${prefix}categoria desconhecida.` };
  const sourceUrl = httpUrl(row.sourceUrl ?? row.source_url);
  if (!sourceUrl) return { ok: false, error: `${prefix}sourceUrl precisa ser http(s).` };
  const authorInput = row.authorUrl ?? row.author_url;
  const authorUrl = authorInput ? httpUrl(authorInput) : null;
  if (authorInput && !authorUrl) return { ok: false, error: `${prefix}authorUrl inválida.` };
  const purchaseInput = row.purchaseUrl ?? row.purchase_url;
  const purchaseUrl = purchaseInput ? httpUrl(purchaseInput) : null;
  if (purchaseInput && !purchaseUrl) return { ok: false, error: `${prefix}purchaseUrl inválida.` };
  let hostedJson: string | null = null;
  if (typeof row.hostedJson === "string" && row.hostedJson.trim()) {
    const parsed = parseWorkflowJson(row.hostedJson);
    if (!parsed.ok) return { ok: false, error: `${prefix}${parsed.error}` };
    hostedJson = parsed.json;
  }
  const licenseNote = cleanMultiline(row.licenseNote ?? row.license_note ?? row.license, 1000) || null;
  if (hostedJson && (!licenseNote || licenseNote.length < 8)) {
    return { ok: false, error: `${prefix}hostedJson só entra com uma nota de licença.` };
  }
  const sourceDateRaw =
    typeof row.sourceDate === "string" ? row.sourceDate : typeof row.source_date === "string" ? row.source_date : "";
  const sourceDate = /^\d{4}-\d{2}-\d{2}$/.test(sourceDateRaw) ? sourceDateRaw : null;
  const addedRaw = typeof row.addedAt === "string" ? row.addedAt : typeof row.added_at === "string" ? row.added_at : "";
  const addedAt = /^\d{4}-\d{2}-\d{2}$/.test(addedRaw) ? addedRaw : sourceDate || todayInBrazil();
  const popularityRaw = Number(row.popularity ?? 0);
  const popularity = Number.isFinite(popularityRaw) ? Math.max(0, Math.min(1_000_000, Math.round(popularityRaw))) : 0;
  const nodeRaw = row.nodeCount ?? row.node_count;
  const nodeCount =
    nodeRaw === undefined || nodeRaw === null || nodeRaw === ""
      ? null
      : Number.isFinite(Number(nodeRaw))
        ? Math.max(0, Math.round(Number(nodeRaw)))
        : null;
  if ((row.nodeCount !== undefined || row.node_count !== undefined) && nodeRaw !== null && nodeRaw !== "" && nodeCount === null) {
    return { ok: false, error: `${prefix}nodeCount inválido.` };
  }
  const difficulty = resolveDifficulty(typeof row.difficulty === "string" ? row.difficulty : null);
  if (row.difficulty && !difficulty) return { ok: false, error: `${prefix}dificuldade inválida.` };
  const listed = row.listed === undefined ? row.published === undefined || Boolean(row.published) : Boolean(row.listed);
  return {
    ok: true,
    value: {
      slug,
      title,
      description,
      explanation: explanationRaw || null,
      integrations: parseIntegrationList(row.integrations),
      category: category.slug,
      difficulty,
      difficultyNote: cleanMultiline(row.difficultyNote ?? row.difficulty_note, 1000) || null,
      authorName: cleanText(row.authorName ?? row.author_name ?? row.author, 120) || null,
      authorUrl,
      sourceUrl,
      sourceName: cleanText(row.sourceName ?? row.source_name ?? row.source, 80) || null,
      sourceDate,
      licenseNote,
      nodeCount,
      jsonDownloadable: row.jsonDownloadable === true || row.json_downloadable === true,
      hostedJson,
      price: cleanText(row.price, 160) || null,
      priceAsShown: cleanText(row.priceAsShown ?? row.price_as_shown, 160) || null,
      purchaseUrl,
      listed,
      addedAt,
      popularity,
      published: row.published === undefined ? true : Boolean(row.published),
    },
  };
}

export function parseSubmission(input: unknown) {
  if (!input || typeof input !== "object") return { ok: false as const, error: "Envio inválido." };
  const row = input as Record<string, unknown>;
  if (typeof row.company_website === "string" && row.company_website.trim()) {
    return { ok: true as const, spam: true as const };
  }
  const title = cleanText(row.title, 140);
  const description = cleanMultiline(row.description, 2000);
  const authorName = cleanText(row.authorName, 120);
  const email = normalizeEmail(typeof row.email === "string" ? row.email : "");
  const category = resolveCategory(typeof row.category === "string" ? row.category : "");
  const integrations = typeof row.integrations === "string" ? row.integrations.trim().slice(0, 500) : "";
  if (title.length < 3) return { ok: false as const, error: "Dê um nome ao template." };
  if (description.length < 8) return { ok: false as const, error: "Conte em uma ou duas frases o que ele faz." };
  if (!category) return { ok: false as const, error: "Escolha uma categoria." };
  if (authorName.length < 2) return { ok: false as const, error: "Diga quem é o autor." };
  const emailError = emailBlockReason(email);
  if (emailError) return { ok: false as const, error: emailError };
  const sourceUrl = row.sourceUrl ? httpUrl(row.sourceUrl) : null;
  if (row.sourceUrl && !sourceUrl) return { ok: false as const, error: "A URL da fonte precisa começar com http ou https." };
  let workflowJson: string | null = null;
  if (typeof row.workflowJson === "string" && row.workflowJson.trim()) {
    const parsed = parseWorkflowJson(row.workflowJson);
    if (!parsed.ok) return { ok: false as const, error: parsed.error };
    workflowJson = parsed.json;
  }
  if (!sourceUrl && !workflowJson) {
    return { ok: false as const, error: "Mande a URL da fonte ou o JSON do fluxo." };
  }
  return {
    ok: true as const,
    spam: false as const,
    value: {
      title,
      description,
      authorName,
      email,
      category: category.slug,
      integrations,
      sourceUrl,
      workflowJson,
    },
  };
}

export function parseSignup(input: unknown) {
  if (!input || typeof input !== "object") return { ok: false as const, error: "Envio inválido." };
  const row = input as Record<string, unknown>;
  if (typeof row.company_website === "string" && row.company_website.trim()) {
    return { ok: true as const, spam: true as const };
  }
  const email = normalizeEmail(typeof row.email === "string" ? row.email : "");
  const reason = emailBlockReason(email);
  if (reason) return { ok: false as const, error: reason };
  return { ok: true as const, spam: false as const, email };
}

const PLANS = new Set(["semana", "destaque", "ambos"]);

export function parseInquiry(input: unknown) {
  if (!input || typeof input !== "object") return { ok: false as const, error: "Envio inválido." };
  const row = input as Record<string, unknown>;
  if (typeof row.company_website === "string" && row.company_website.trim()) {
    return { ok: true as const, spam: true as const };
  }
  const name = cleanText(row.name, 120);
  const email = normalizeEmail(typeof row.email === "string" ? row.email : "");
  const message = cleanMultiline(row.message, 4000);
  const plan = typeof row.plan === "string" ? row.plan : "";
  if (name.length < 2) return { ok: false as const, error: "Diga seu nome." };
  const emailError = emailBlockReason(email);
  if (emailError) return { ok: false as const, error: emailError };
  if (message.length < 8) return { ok: false as const, error: "Conte o que você quer anunciar." };
  if (!PLANS.has(plan)) return { ok: false as const, error: "Escolha um plano." };
  return { ok: true as const, spam: false as const, value: { name, email, message, plan } };
}

export function normalizePath(input: string) {
  if (!input.startsWith("/")) return null;
  const path = input.split("?")[0]?.split("#")[0] ?? "";
  if (!path || path.length > 180 || path.includes("..")) return null;
  if (!/^\/[A-Za-z0-9/_-]*$/.test(path)) return null;
  if (path.startsWith("/api") || path.startsWith("/_next")) return null;
  return path === "" ? "/" : path;
}

export function formatDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function hostOf(value: string | null) {
  if (!value) return "";
  try {
    return new URL(value).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}
