import { renderNewsletter } from "@/lib/newsletter";
import { newsletterContext } from "@/lib/queries";
import { siteUrl } from "@/lib/config";

export async function GET() {
  const { picks, sponsorLine } = await newsletterContext();
  const html = renderNewsletter({ picks, sponsorLine, siteUrl: siteUrl() });
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
