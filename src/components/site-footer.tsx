import Link from "next/link";
import { CATEGORIES, INTEGRATIONS } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/config";

export function SiteFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-2">
        <div>
          <p className="font-display text-lg">{SITE_NAME}</p>
          <p className="mt-2 max-w-sm leading-relaxed text-muted">{disclaimer}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <nav aria-label="Categorias">
            <p className="font-semibold">Categorias</p>
            <ul className="mt-2 space-y-1">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link href={`/categoria/${category.slug}`} className="text-muted hover:text-teal">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Integrações">
            <p className="font-semibold">Integrações</p>
            <ul className="mt-2 space-y-1">
              {INTEGRATIONS.slice(0, 8).map((integration) => (
                <li key={integration.slug}>
                  <Link href={`/integracao/${integration.slug}`} className="text-muted hover:text-teal">
                    {integration.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
