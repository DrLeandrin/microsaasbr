import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PRICE_FEATURE, PRICE_WEEK } from "@/lib/config";
import { pageMetadata } from "@/lib/meta";
import { publicStats } from "@/lib/queries";

export const metadata: Metadata = pageMetadata(
  "Anuncie",
  "Espaço para quem vende template ou serviço de automação n8n no Brasil.",
  "/patrocinar",
);

export default async function PatrocinarPage() {
  const stats = await publicStats();
  const numbers = [
    { label: "Templates no diretório", value: stats.templates },
    { label: "Pessoas na lista", value: stats.subscribers },
    { label: "Páginas vistas em 30 dias", value: stats.pageviews30d },
  ];

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-display text-3xl leading-tight sm:text-4xl">Anuncie para quem automatiza no Brasil</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Quem chega aqui está montando fluxo de WhatsApp, Pix, nota e loja. Dá para aparecer na barra da semana ou em destaque na categoria.
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {numbers.map((item) => (
          <div key={item.label} className="rounded-2xl bg-card px-4 py-3 ring-1 ring-line">
            <dt className="text-xs text-muted">{item.label}</dt>
            <dd className="mt-1 font-display text-3xl">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl bg-ink p-5 text-paper">
          <h2 className="font-display text-2xl">Site + newsletter</h2>
          <p className="mt-2 font-display text-3xl">{PRICE_WEEK}</p>
          <p className="mt-2 text-sm leading-relaxed text-paper/80">Barra no topo do site durante a semana e uma linha de patrocínio na edição de terça.</p>
        </article>
        <article className="rounded-2xl bg-card p-5 ring-1 ring-line">
          <h2 className="font-display text-2xl">Destaque</h2>
          <p className="mt-2 font-display text-3xl">{PRICE_FEATURE}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">Espaço no topo da página de uma categoria, para quem vende template ou serviço de automação.</p>
        </article>
      </div>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Fale com a gente</h2>
        <p className="mt-1 text-sm text-muted">Sem checkout. A gente combina o período por e-mail.</p>
        <InquiryForm />
      </section>
    </main>
  );
}
