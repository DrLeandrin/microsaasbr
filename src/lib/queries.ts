import { and, desc, eq, gte, sql } from "drizzle-orm";
import { logError } from "@/lib/errors";
import { getDb, requireDb } from "@/lib/db";
import type { TemplateView } from "@/lib/filter";
import { daysAgo } from "@/lib/validators";
import { entries, pageviews, searches, signups, sponsorClicks, sponsorInquiries, sponsorWeeks } from "@/lib/schema";

function asIntegrations(value: unknown): { slug: string; name: string }[] {
  const source = typeof value === "string" ? safeParse(value) : value;
  if (!Array.isArray(source)) return [];
  return source.flatMap((item) => {
    if (typeof item === "string") return [{ slug: item, name: item }];
    if (item && typeof item === "object" && "slug" in item && "name" in item) {
      const slug = String(item.slug);
      const name = String(item.name);
      return slug && name ? [{ slug, name }] : [];
    }
    return [];
  });
}

function safeParse(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return [];
  }
}

function asBool(value: unknown) {
  return value === true || value === "t" || value === "true";
}

function asCount(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

export async function listPublished(): Promise<TemplateView[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const since = daysAgo(30);
    const [rows, viewRows] = await Promise.all([
      db
        .select({
          id: entries.id,
          slug: entries.slug,
          title: entries.title,
          description: entries.description,
          explanation: entries.explanation,
          integrations: entries.integrations,
          category: entries.category,
          difficulty: entries.difficulty,
          difficultyNote: entries.difficultyNote,
          authorName: entries.authorName,
          authorUrl: entries.authorUrl,
          sourceUrl: entries.sourceUrl,
          sourceName: entries.sourceName,
          sourceDate: entries.sourceDate,
          licenseNote: entries.licenseNote,
          nodeCount: entries.nodeCount,
          jsonDownloadable: entries.jsonDownloadable,
          hasHostedJson: sql<boolean>`${entries.hostedJson} is not null`,
          addedAt: entries.addedAt,
          popularity: entries.popularity,
        })
        .from(entries)
        .where(and(eq(entries.published, true), eq(entries.listed, true))),
      db
        .select({
          path: pageviews.path,
          views: sql<number>`coalesce(sum(${pageviews.count}), 0)::int`,
        })
        .from(pageviews)
        .where(and(gte(pageviews.day, since), sql`${pageviews.path} like '/t/%'`))
        .groupBy(pageviews.path),
    ]);
    const views = new Map(viewRows.map((row) => [row.path, asCount(row.views)]));
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      explanation: row.explanation,
      integrations: asIntegrations(row.integrations),
      category: row.category,
      difficulty: row.difficulty,
      difficultyNote: row.difficultyNote,
      authorName: row.authorName,
      authorUrl: row.authorUrl,
      sourceUrl: row.sourceUrl,
      sourceName: row.sourceName,
      sourceDate: row.sourceDate ? String(row.sourceDate) : null,
      licenseNote: row.licenseNote,
      nodeCount: row.nodeCount,
      jsonDownloadable: row.jsonDownloadable,
      hasHostedJson: asBool(row.hasHostedJson),
      addedAt: String(row.addedAt),
      popularity: row.popularity,
      views: views.get(`/t/${row.slug}`) ?? 0,
    }));
  } catch (error) {
    await logError(error, "listPublished");
    return [];
  }
}

export async function getPublishedBySlug(slug: string) {
  const items = await listPublished();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getHostedJson(slug: string) {
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select({ hostedJson: entries.hostedJson })
      .from(entries)
      .where(and(eq(entries.slug, slug), eq(entries.published, true), eq(entries.listed, true)))
      .limit(1);
    return row?.hostedJson ?? null;
  } catch (error) {
    await logError(error, "getHostedJson");
    return null;
  }
}

export type SponsorCard = {
  slug: string;
  name: string;
  url: string;
  barText: string;
  newsletterLine: string | null;
  slot: string;
  categorySlug: string | null;
};

function mapSponsor(row: typeof sponsorWeeks.$inferSelect): SponsorCard {
  return {
    slug: row.slug,
    name: row.name,
    url: row.url,
    barText: row.barText,
    newsletterLine: row.newsletterLine,
    slot: row.slot,
    categorySlug: row.categorySlug,
  };
}

async function activeSponsors() {
  const db = getDb();
  if (!db) return [];
  const today = daysAgo(0);
  return db
    .select()
    .from(sponsorWeeks)
    .where(and(sql`${sponsorWeeks.startsOn} <= ${today}`, sql`${sponsorWeeks.endsOn} >= ${today}`))
    .orderBy(desc(sponsorWeeks.id));
}

export async function getWeeklySponsor(): Promise<SponsorCard | null> {
  try {
    const rows = await activeSponsors();
    const row = rows.find((item) => item.slot === "semana");
    return row ? mapSponsor(row) : null;
  } catch (error) {
    await logError(error, "getWeeklySponsor");
    return null;
  }
}

export async function getDestaque(categorySlug: string): Promise<SponsorCard | null> {
  try {
    const rows = (await activeSponsors()).filter((item) => item.slot === "destaque");
    const row = rows.find((item) => item.categorySlug === categorySlug) ?? rows.find((item) => !item.categorySlug);
    return row ? mapSponsor(row) : null;
  } catch (error) {
    await logError(error, "getDestaque");
    return null;
  }
}

export async function getSponsorBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db.select().from(sponsorWeeks).where(eq(sponsorWeeks.slug, slug)).limit(1);
    return row ? mapSponsor(row) : null;
  } catch (error) {
    await logError(error, "getSponsorBySlug");
    return null;
  }
}

export async function publicStats() {
  const empty = { templates: 0, subscribers: 0, pageviews30d: 0 };
  const db = getDb();
  if (!db) return empty;
  try {
    const since = daysAgo(30);
    const [templateCount, subscriberCount, views] = await Promise.all([
      db
      .select({ value: sql<number>`count(*)::int` })
      .from(entries)
      .where(and(eq(entries.published, true), eq(entries.listed, true))),
      db.select({ value: sql<number>`count(*)::int` }).from(signups),
      db
        .select({ value: sql<number>`coalesce(sum(${pageviews.count}), 0)::int` })
        .from(pageviews)
        .where(gte(pageviews.day, since)),
    ]);
    return {
      templates: asCount(templateCount[0]?.value),
      subscribers: asCount(subscriberCount[0]?.value),
      pageviews30d: asCount(views[0]?.value),
    };
  } catch (error) {
    await logError(error, "publicStats");
    return empty;
  }
}

export async function logZeroResultSearch(query: string) {
  const trimmed = query.trim().slice(0, 180);
  if (!trimmed) return;
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(searches).values({ query: trimmed });
  } catch (error) {
    await logError(error, "logZeroResultSearch");
  }
}

export async function newsletterContext() {
  const [templates, sponsor] = await Promise.all([listPublished(), getWeeklySponsor()]);
  const picks = [...templates]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.id - a.id)
    .slice(0, 5)
    .map((item) => ({ title: item.title, description: item.description, slug: item.slug }));
  return { picks, sponsorLine: sponsor?.newsletterLine || sponsor?.name || null };
}

export async function listSponsorWeeks() {
  const db = requireDb();
  return db.select().from(sponsorWeeks).orderBy(desc(sponsorWeeks.startsOn));
}

export async function adminStats() {
  const db = requireDb();
  const since = daysAgo(30);
  const [templateCount, subscriberCount, viewsByDay, clicks, inquiryCount, recentInquiries] = await Promise.all([
    db.select({ value: sql<number>`count(*)::int` }).from(entries),
    db.select({ value: sql<number>`count(*)::int` }).from(signups),
    db
      .select({
        day: pageviews.day,
        count: sql<number>`coalesce(sum(${pageviews.count}), 0)::int`,
      })
      .from(pageviews)
      .where(gte(pageviews.day, since))
      .groupBy(pageviews.day)
      .orderBy(pageviews.day),
    db
      .select({
        slug: sponsorClicks.sponsorSlug,
        clicks: sql<number>`count(*)::int`,
      })
      .from(sponsorClicks)
      .groupBy(sponsorClicks.sponsorSlug)
      .orderBy(desc(sql`count(*)`)),
    db.select({ value: sql<number>`count(*)::int` }).from(sponsorInquiries),
    db.select().from(sponsorInquiries).orderBy(desc(sponsorInquiries.createdAt)).limit(20),
  ]);
  const pageviewsByDay = viewsByDay.map((row) => ({ day: String(row.day), count: asCount(row.count) }));
  return {
    entries: asCount(templateCount[0]?.value),
    subscribers: asCount(subscriberCount[0]?.value),
    pageviews30d: pageviewsByDay.reduce((sum, row) => sum + row.count, 0),
    pageviewsByDay,
    sponsorClicks: clicks.map((row) => ({ slug: row.slug, clicks: asCount(row.clicks) })),
    inquiries: asCount(inquiryCount[0]?.value),
    recentInquiries,
  };
}

export async function recentSearches() {
  const db = requireDb();
  return db.select().from(searches).orderBy(desc(searches.createdAt)).limit(100);
}
