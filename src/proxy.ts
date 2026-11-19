import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Next.js 16 proxy (ex-middleware): marca o caminho. A contagem mora em POST /api/pageview. */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
