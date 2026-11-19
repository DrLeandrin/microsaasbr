import { and, eq, gte, sql } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { entries, pageviews, signups, sponsorClicks, sponsorInquiries, sponsorWeeks, submissions } from "@/lib/schema";
import { slugify } from "@/lib/slug";
import { parseIntegrationList, todayInBrazil, type TemplateWrite } from "@/lib/validators";

export async function upsertTemplates(items: TemplateWrite[]) {
  const db = requireDb();
  const saved: { id: number; slug: string }[] = [];
  await db.transaction(async (tx) => {
    for (const item of items) {
      const [row] = await tx
        .insert(entries)
        .values({
          slug: item.slug,
          title: item.title,
          description: item.description,
          explanation: item.explanation,
          integrations: item.integrations,
          category: item.category,
          difficulty: item.difficulty,
          difficultyNote: item.difficultyNote,
          authorName: item.authorName,
          authorUrl: item.authorUrl,
          sourceUrl: item.sourceUrl,
          sourceName: item.sourceName,
          sourceDate: item.sourceDate,
          licenseNote: item.licenseNote,
          nodeCount: item.nodeCount,
          jsonDownloadable: item.jsonDownloadable,
          hostedJson: item.hostedJson,
          price: item.price,
          priceAsShown: item.priceAsShown,
          purchaseUrl: item.purchaseUrl,
          listed: item.listed,
          addedAt: item.addedAt,
          popularity: item.popularity,
          published: item.published,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: entries.slug,
          set: {
            title: item.title,
            description: item.description,
            explanation: item.explanation,
            integrations: item.integrations,
            category: item.category,
            difficulty: item.difficulty,
            difficultyNote: item.difficultyNote,
            authorName: item.authorName,
            authorUrl: item.authorUrl,
            sourceUrl: item.sourceUrl,
            sourceName: item.sourceName,
            sourceDate: item.sourceDate,
            licenseNote: item.licenseNote,
            nodeCount: item.nodeCount,
            jsonDownloadable: item.jsonDownloadable,
            hostedJson: item.hostedJson,
            price: item.price,
            priceAsShown: item.priceAsShown,
            purchaseUrl: item.purchaseUrl,
            listed: item.listed,
            addedAt: item.addedAt,
            popularity: item.popularity,
            published: item.published,
            updatedAt: new Date(),
          },
        })
        .returning({ id: entries.id, slug: entries.slug });
      if (row) saved.push(row);
    }
  });
  return saved;
}

export async function insertSubmission(value: {
  title: string;
  description: string;
  authorName: string;
  email: string;
  category: string;
  integrations: string;
  sourceUrl: string | null;
  workflowJson: string | null;
}) {
  const db = requireDb();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db
    .select({ id: submissions.id })
    .from(submissions)
    .where(and(eq(submissions.email, value.email), gte(submissions.createdAt, since)));
  if (recent.length >= 3) return { limited: true as const };
  const [row] = await db.insert(submissions).values(value).returning({ id: submissions.id });
  return { limited: false as const, id: row?.id };
}

export async function listPendingSubmissions() {
  const db = requireDb();
  return db.select().from(submissions).where(eq(submissions.status, "pending")).orderBy(sql`${submissions.createdAt} desc`);
}

export async function decideSubmission(id: number, decision: "approve" | "reject") {
  const db = requireDb();
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  if (!submission) return { ok: false as const, status: 404, error: "Envio não encontrado." };
  if (submission.status !== "pending") {
    return { ok: false as const, status: 409, error: "Esse envio já foi revisado." };
  }
  if (decision === "reject") {
    await db.update(submissions).set({ status: "rejected", reviewedAt: new Date() }).where(eq(submissions.id, id));
    return { ok: true as const, status: "rejected" as const };
  }
  if (!submission.sourceUrl) {
    return {
      ok: false as const,
      status: 400,
      error: "Para publicar, o envio precisa da URL da fonte. O JSON fica na fila e não é hospedado daqui.",
    };
  }
  const description = submission.description.replace(/\s+/g, " ").trim().slice(0, 320);
  const [saved] = await upsertTemplates([
    {
      slug: slugify(submission.title),
      title: submission.title,
      description,
      explanation: submission.description,
      integrations: parseIntegrationList(submission.integrations),
      category: submission.category,
      difficulty: null,
      difficultyNote: null,
      authorName: submission.authorName,
      authorUrl: null,
      sourceUrl: submission.sourceUrl,
      sourceName: null,
      sourceDate: todayInBrazil(),
      licenseNote: "Enviado pela comunidade. A licença é a da fonte original.",
      nodeCount: null,
      jsonDownloadable: false,
      hostedJson: null,
      price: null,
      priceAsShown: null,
      purchaseUrl: null,
      listed: true,
      addedAt: todayInBrazil(),
      popularity: 0,
      published: true,
    },
  ]);
  await db
    .update(submissions)
    .set({ status: "approved", reviewedAt: new Date(), entryId: saved?.id ?? null })
    .where(eq(submissions.id, id));
  return { ok: true as const, status: "approved" as const, entry: saved };
}

export async function insertSignup(email: string) {
  const db = requireDb();
  const inserted = await db.insert(signups).values({ email }).onConflictDoNothing().returning({ id: signups.id });
  if (inserted.length === 0) return { already: true as const, id: null };
  return { already: false as const, id: inserted[0]?.id ?? null };
}

export async function markSignupSynced(email: string, resendId: string | null) {
  const db = requireDb();
  await db.update(signups).set({ resendId }).where(eq(signups.email, email));
}

export async function insertInquiry(value: { name: string; email: string; message: string; plan: string }) {
  const db = requireDb();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db
    .select({ id: sponsorInquiries.id })
    .from(sponsorInquiries)
    .where(and(eq(sponsorInquiries.email, value.email), gte(sponsorInquiries.createdAt, since)));
  if (recent.length >= 3) return { limited: true as const };
  const [row] = await db.insert(sponsorInquiries).values(value).returning({ id: sponsorInquiries.id });
  return { limited: false as const, id: row?.id };
}

export async function insertSponsor(value: {
  slug: string;
  name: string;
  url: string;
  barText: string;
  startsOn: string;
  endsOn: string;
  newsletterLine: string | null;
  slot: string;
  categorySlug: string | null;
}) {
  const db = requireDb();
  const [row] = await db
    .insert(sponsorWeeks)
    .values(value)
    .onConflictDoUpdate({
      target: sponsorWeeks.slug,
      set: {
        name: value.name,
        url: value.url,
        barText: value.barText,
        startsOn: value.startsOn,
        endsOn: value.endsOn,
        newsletterLine: value.newsletterLine,
        slot: value.slot,
        categorySlug: value.categorySlug,
      },
    })
    .returning();
  return row;
}

export async function recordClick(slug: string) {
  const db = getDbSafe();
  if (!db) return;
  await db.insert(sponsorClicks).values({ sponsorSlug: slug });
}

export async function recordPageview(path: string) {
  const db = getDbSafe();
  if (!db) return;
  const day = todayInBrazil();
  await db
    .insert(pageviews)
    .values({ path, day, count: 1 })
    .onConflictDoUpdate({
      target: [pageviews.path, pageviews.day],
      set: { count: sql`${pageviews.count} + 1` },
    });
}

function getDbSafe() {
  try {
    return requireDb();
  } catch {
    return null;
  }
}
