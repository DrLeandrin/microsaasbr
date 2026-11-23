import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/filter-bar";
import { SignupForm } from "@/components/signup-form";
import { TemplateGrid } from "@/components/template-card";
import { SITE_DESCRIPTION } from "@/lib/config";
import { byNewest, byPopular, filterTemplates, firstParam } from "@/lib/filter";
import { logZeroResultSearch, listPublished } from "@/lib/queries";

export const metadata: Metadata = {
  title: { absolute: "n8n Brasil — automações para negócios brasileiros" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    q: firstParam(params.q).trim(),
    categoria: firstParam(params.categoria),
    integracao: firstParam(params.integracao),
    dificuldade: firstParam(params.dificuldade),
  };
  const ordem = firstParam(params.ordem) === "populares" ? "populares" : "recentes";
  const all = await listPublished();
  const integrations = uniqueIntegrations(all);
  const filtered = filterTemplates(all, filters);
  if (filters.q && filtered.length === 0) await logZeroResultSearch(filters.q);
  const ordered = ordem === "populares" ? byPopular(filtered) : byNewest(filtered);
  const filtering = Boolean(filters.q || filters.categoria || filters.integracao || filters.dificuldade);

  return (
    <main id="conteudo" className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
      <h1 className="font-display text-3xl leading-tight sm:text-4xl">Automações n8n para negócios brasileiros</h1>
      <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-ink-soft sm:block sm:text-base">
        Templates com fonte conferida para WhatsApp, Pix, nota fiscal, loja e infoproduto. O botão abre o fluxo lá na origem.
      </p>
      <p className="mt-3 rounded-full bg-teal-soft px-3 py-2 text-sm">
        <Link href="/comece-aqui" className="font-semibold text-teal">
          Comece aqui
        </Link>
        <span className="text-ink-soft"> se você ainda não usa n8n. O que é, quanto custa e o primeiro fluxo.</span>
      </p>
      <FilterBar {...filters} ordem={ordem} integrations={integrations} />
      <p className="mt-4 text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "template" : "templates"}
        {filtering ? " com esses filtros" : ""}.
      </p>
      <section className="mt-4" aria-labelledby="lista-titulo">
        <h2 id="lista-titulo" className="font-display text-2xl">
          {filtering ? "Resultados" : ordem === "populares" ? "Mais populares" : "Recém-chegados"}
        </h2>
        {filtered.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-line bg-card px-4 py-8">
            <p className="text-sm leading-relaxed">
              {all.length === 0
                ? "Nenhum template publicado ainda. O diretório está pronto para receber o primeiro fluxo."
                : "Nada encontrado. Tente outro termo ou tire um filtro."}
            </p>
            <Link href="/enviar" className="mt-3 inline-block text-sm font-semibold text-teal">
              Enviar um template
            </Link>
          </div>
        ) : (
          <div className="mt-3">
            <TemplateGrid templates={ordered} />
          </div>
        )}
      </section>
      <SignupForm />
    </main>
  );
}

function uniqueIntegrations(templates: Awaited<ReturnType<typeof listPublished>>) {
  const map = new Map<string, string>();
  for (const template of templates) {
    for (const integration of template.integrations) {
      if (!map.has(integration.slug)) map.set(integration.slug, integration.name);
    }
  }
  return [...map.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}
