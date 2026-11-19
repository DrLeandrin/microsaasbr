/** Pulls template rows out of a seed file or an admin bulk payload. Paid rows stay unpublished. */
export function itemsFromSeedBody(body: unknown) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  const record = body as Record<string, unknown>;
  const templates = Array.isArray(record.templates)
    ? record.templates
    : Array.isArray(record.entries)
      ? record.entries
      : [];
  const paid = Array.isArray(record.paid)
    ? record.paid.map((item) =>
        item && typeof item === "object" ? { ...(item as Record<string, unknown>), published: false, listed: false } : item,
      )
    : [];
  return [...templates, ...paid];
}
