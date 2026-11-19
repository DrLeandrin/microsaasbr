import { json, withAdmin } from "@/lib/http";
import { recentSearches } from "@/lib/queries";

export async function GET(request: Request) {
  return withAdmin(request, "/api/admin/searches", async () => json({ searches: await recentSearches() }));
}
