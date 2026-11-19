import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-ink">
          <span aria-hidden className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-teal" />
            <span className="h-px w-2 bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-clay" />
          </span>
          {SITE_NAME}
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-4 text-sm font-medium">
          <Link href="/enviar" className="hover:text-teal">
            Enviar
          </Link>
          <Link href="/patrocinar" className="hover:text-teal">
            Anuncie
          </Link>
        </nav>
      </div>
    </header>
  );
}
