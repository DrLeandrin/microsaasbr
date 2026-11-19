import Link from "next/link";
import { CATEGORIES, DIFFICULTIES, categoryName, integrationName } from "@/lib/catalog";
import type { IntegrationRef } from "@/lib/validators";

export function FilterBar({
  q,
  categoria,
  integracao,
  dificuldade,
  ordem,
  integrations,
}: {
  q: string;
  categoria: string;
  integracao: string;
  dificuldade: string;
  ordem: string;
  integrations: IntegrationRef[];
}) {
  return (
    <form action="/" className="mt-4 grid gap-3">
      <div>
        <label htmlFor="q" className="text-sm font-medium">
          Buscar
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="WhatsApp, Pix, Bling, nota fiscal…"
          className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-3 text-base"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-xs font-medium sm:text-sm">
          Categoria
          <select name="categoria" defaultValue={categoria} className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-2 text-sm sm:px-3 sm:text-base">
            <option value="">Todas</option>
            {CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium sm:text-sm">
          Integração
          <select name="integracao" defaultValue={integracao} className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-2 text-sm sm:px-3 sm:text-base">
            <option value="">Todas</option>
            {integrations.map((integration) => (
              <option key={integration.slug} value={integration.slug}>
                {integration.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium sm:text-sm">
          Dificuldade
          <select name="dificuldade" defaultValue={dificuldade} className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-2 text-sm sm:px-3 sm:text-base">
            <option value="">Todas</option>
            {DIFFICULTIES.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper">
          Filtrar
        </button>
        <div className="flex gap-3 text-sm">
          <Link href={keep({ q, categoria, integracao, dificuldade, ordem: "recentes" })} className={ordem === "populares" ? "text-muted" : "font-semibold text-teal"}>
            Mais recentes
          </Link>
          <Link href={keep({ q, categoria, integracao, dificuldade, ordem: "populares" })} className={ordem === "populares" ? "font-semibold text-teal" : "text-muted"}>
            Mais populares
          </Link>
        </div>
      </div>
      <nav aria-label="Categorias" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="shrink-0 rounded-full border border-line bg-card px-3 py-2 text-sm hover:border-teal"
          >
            {category.name}
          </Link>
        ))}
      </nav>
      <p className="sr-only">
        Filtro atual: {categoria ? categoryName(categoria) : "todas as categorias"}, {integracao ? integrationName(integracao) : "todas as integrações"}.
      </p>
    </form>
  );
}

function keep(input: { q: string; categoria: string; integracao: string; dificuldade: string; ordem: string }) {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.categoria) params.set("categoria", input.categoria);
  if (input.integracao) params.set("integracao", input.integracao);
  if (input.dificuldade) params.set("dificuldade", input.dificuldade);
  if (input.ordem === "populares") params.set("ordem", "populares");
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
