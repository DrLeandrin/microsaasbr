import { adminAuthorized } from "@/lib/admin-auth";
import { DatabaseUnavailable } from "@/lib/db";
import { logError } from "@/lib/errors";

export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function withAdmin(request: Request, path: string, run: () => Promise<Response>) {
  if (!adminAuthorized(request)) return json({ error: "Não autorizado." }, 401);
  try {
    return await run();
  } catch (error) {
    await logError(error, path);
    if (error instanceof DatabaseUnavailable) return json({ error: "Banco não configurado." }, 503);
    return json({ error: "Erro ao falar com o banco." }, 500);
  }
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
