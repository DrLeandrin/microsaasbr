import { getDb } from "@/lib/db";
import { errors } from "@/lib/schema";

function clip(value: string, max: number) {
  return value.length > max ? value.slice(0, max) : value;
}

export async function logError(error: unknown, path?: string) {
  try {
    const db = getDb();
    if (!db) return;
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "Erro desconhecido";
    const stack = error instanceof Error ? error.stack : undefined;
    await db.insert(errors).values({
      message: clip(message || "Erro desconhecido", 2000),
      stack: stack ? clip(stack, 8000) : null,
      path: path ? clip(path, 300) : null,
    });
  } catch {
    // Logging must not take the request down with it.
  }
}

export function ignoredErrorDigest(error: unknown) {
  if (!error || typeof error !== "object" || !("digest" in error)) return false;
  const digest = String(error.digest);
  return digest.startsWith("NEXT_HTTP_ERROR_FALLBACK") || digest.startsWith("NEXT_REDIRECT");
}
