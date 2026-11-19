import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignupForm } from "@/components/signup-form";
import { categoryName, difficultyName } from "@/lib/catalog";
import { pageMetadata } from "@/lib/meta";
import { getPublishedBySlug } from "@/lib/queries";
import { formatDate, hostOf } from "@/lib/validators";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = await getPublishedBySlug(slug);
  if (!template) return pageMetadata("Template", "Template de automação n8n.", `/t/${slug}`);
  return pageMetadata(template.title, template.description, `/t/${template.slug}`);
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const template = await getPublishedBySlug(slug);
  if (!template) notFound();
  const difficulty = difficultyName(template.difficulty);
  const when = formatDate(template.sourceDate || template.addedAt);

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-6">
      <p className="text-sm text-muted">
        <Link href="/" className="hover:text-teal">
          Início
        </Link>
        {" · "}
        <Link href={`/categoria/${template.category}`} className="hover:text-teal">
          {categoryName(template.category)}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {difficulty ? <span className="rounded-full bg-teal-soft px-2 py-1 font-medium text-teal">{difficulty}</span> : null}
        {template.nodeCount ? <span className="rounded-full bg-paper px-2 py-1 ring-1 ring-line">{template.nodeCount} nós</span> : null}
        {template.sourceName ? <span className="rounded-full bg-paper px-2 py-1 ring-1 ring-line">{template.sourceName}</span> : null}
      </div>
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{template.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">{template.description}</p>
      {template.sourceUrl ? (
        <a
          href={template.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 text-base font-semibold text-white"
        >
          Abrir template
        </a>
      ) : (
        <p className="mt-5 text-sm">A fonte deste template ainda não foi publicada.</p>
      )}
      {template.sourceUrl ? (
        <p className="mt-2 text-sm text-muted">Abre em {hostOf(template.sourceUrl)}. A gente não republica o JSON.</p>
      ) : null}
      {template.jsonDownloadable ? (
        <p className="mt-1 text-sm text-muted">O JSON pode ser baixado na página da fonte.</p>
      ) : null}
      {template.hasHostedJson ? (
        <p className="mt-2">
          <a href={`/api/templates/${template.slug}/json`} className="text-sm font-semibold text-teal">
            Baixar JSON hospedado aqui
          </a>
        </p>
      ) : null}
      {template.licenseNote ? (
        <p className="mt-4 rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-line">Licença: {template.licenseNote}</p>
      ) : null}
      {template.explanation ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl">O que automatiza</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{template.explanation}</p>
        </section>
      ) : null}
      {template.difficultyNote ? <p className="mt-4 text-sm leading-relaxed text-muted">{template.difficultyNote}</p> : null}
      {template.integrations.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Integrações</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {template.integrations.map((integration) => (
              <li key={integration.slug}>
                <Link href={`/integracao/${integration.slug}`} className="rounded-full bg-teal-soft px-3 py-2 text-sm font-medium text-teal">
                  {integration.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Autor</dt>
          <dd className="font-medium">
            {template.authorUrl ? (
              <a href={template.authorUrl} target="_blank" rel="noopener noreferrer" className="text-teal">
                {template.authorName || "Ver perfil"}
              </a>
            ) : (
              template.authorName || "Não informado"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Data na fonte</dt>
          <dd className="font-medium">{when}</dd>
        </div>
      </dl>
      <SignupForm />
    </main>
  );
}
