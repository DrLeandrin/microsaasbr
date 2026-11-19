import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignupForm } from "@/components/signup-form";
import { TemplateGrid } from "@/components/template-card";
import { integrationBySlug } from "@/lib/catalog";
import { byNewest } from "@/lib/filter";
import { pageMetadata } from "@/lib/meta";
import { listPublished } from "@/lib/queries";
import { humanizeSlug } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const known = integrationBySlug(slug);
  const name = known?.name ?? humanizeSlug(slug);
  const title = `Automações n8n com ${name}`;
  const description = known?.description ?? `Templates de n8n que usam ${name}, escolhidos para a rotina de negócios no Brasil.`;
  return pageMetadata(title, description, `/integracao/${slug}`);
}

export default async function IntegrationPage({ params }: Props) {
  const { slug } = await params;
  const known = integrationBySlug(slug);
  const templates = await listPublished();
  const matches = byNewest(templates.filter((template) => template.integrations.some((item) => item.slug === slug)));
  if (!known && matches.length === 0) notFound();
  const name = matches[0]?.integrations.find((item) => item.slug === slug)?.name ?? known?.name ?? humanizeSlug(slug);
  const description = known?.description ?? `Templates de n8n que usam ${name}.`;

  return (
    <main id="conteudo" className="mx-auto max-w-5xl px-4 py-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">Integração</p>
      <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">Automações n8n com {name}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{description}</p>
      <div className="mt-5">
        <TemplateGrid templates={matches} />
      </div>
      <SignupForm />
    </main>
  );
}
