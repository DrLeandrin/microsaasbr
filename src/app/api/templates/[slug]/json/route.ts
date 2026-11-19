import { getHostedJson } from "@/lib/queries";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const json = await getHostedJson(slug);
  if (!json) return new Response("Não encontrado", { status: 404 });
  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
