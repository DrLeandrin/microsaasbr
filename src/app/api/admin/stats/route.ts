import { json, withAdmin } from "@/lib/http";
import { adminStats } from "@/lib/queries";

export async function GET(request: Request) {
  return withAdmin(request, "/api/admin/stats", async () => json(await adminStats()));
}
