import { json, readJson, withAdmin } from "@/lib/http";
import { decideSubmission } from "@/lib/writes";

export async function POST(request: Request) {
  return withAdmin(request, "/api/admin/approve", async () => {
    const body = (await readJson(request)) as { id?: unknown; decision?: unknown } | null;
    const id = Number(body?.id);
    const decision = body?.decision === "approve" || body?.decision === "reject" ? body.decision : null;
    if (!Number.isInteger(id) || id < 1 || !decision) {
      return json({ error: "Informe id e decision (approve ou reject)." }, 400);
    }
    const result = await decideSubmission(id, decision);
    if (!result.ok) return json({ error: result.error }, result.status);
    return json(result);
  });
}
