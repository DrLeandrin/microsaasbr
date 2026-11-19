import { logError } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizePath } from "@/lib/validators";
import { recordPageview } from "@/lib/writes";

export async function POST(request: Request) {
  if (!rateLimit(`pv:${clientIp(request)}`, 90, 60_000)) return new Response(null, { status: 204 });
  let path = "";
  try {
    const body = (await request.json()) as { path?: unknown };
    path = typeof body.path === "string" ? body.path : "";
  } catch {
    return new Response(null, { status: 204 });
  }
  const normalized = normalizePath(path);
  if (!normalized) return new Response(null, { status: 204 });
  try {
    await recordPageview(normalized);
  } catch (error) {
    await logError(error, normalized);
  }
  return new Response(null, { status: 204 });
}
