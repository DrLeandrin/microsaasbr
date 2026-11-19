import { json, withAdmin } from "@/lib/http";
import { listPendingSubmissions } from "@/lib/writes";

export async function GET(request: Request) {
  return withAdmin(request, "/api/admin/queue", async () => {
    const submissions = await listPendingSubmissions();
    return json({ submissions });
  });
}
