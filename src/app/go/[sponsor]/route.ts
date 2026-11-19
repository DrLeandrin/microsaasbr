import { NextResponse } from "next/server";
import { logError } from "@/lib/errors";
import { getSponsorBySlug } from "@/lib/queries";
import { httpUrl } from "@/lib/validators";
import { recordClick } from "@/lib/writes";

export async function GET(_request: Request, context: { params: Promise<{ sponsor: string }> }) {
  const { sponsor } = await context.params;
  const row = await getSponsorBySlug(sponsor);
  const target = row ? httpUrl(row.url) : null;
  if (!row || !target) return NextResponse.redirect(new URL("/patrocinar", _request.url), 302);
  try {
    await recordClick(row.slug);
  } catch (error) {
    await logError(error, `/go/${sponsor}`);
  }
  return NextResponse.redirect(target, 302);
}
