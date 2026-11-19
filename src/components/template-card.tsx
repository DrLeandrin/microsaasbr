import Link from "next/link";
import { categoryName, difficultyName } from "@/lib/catalog";
import { formatDate } from "@/lib/validators";
import type { TemplateView } from "@/lib/filter";

export function TemplateCard({ template }: { template: TemplateView }) {
  const difficulty = difficultyName(template.difficulty);
  const when = formatDate(template.sourceDate || template.addedAt);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Link href={`/categoria/${template.category}`} className="rounded-full bg-teal-soft px-2 py-1 font-medium text-teal">
          {categoryName(template.category)}
        </Link>
        {difficulty ? <span className="text-muted">{difficulty}</span> : null}
        {template.nodeCount ? <span className="text-muted">{template.nodeCount} nós</span> : null}
      </div>
      <h3 className="mt-3 font-display text-xl leading-tight">
        <Link href={`/t/${template.slug}`} className="hover:text-teal">
          {template.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{template.description}</p>
      {template.integrations.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {template.integrations.slice(0, 4).map((integration) => (
            <li key={integration.slug}>
              <Link
                href={`/integracao/${integration.slug}`}
                className="rounded-md bg-paper px-1.5 py-1 text-xs text-muted ring-1 ring-line"
              >
                {integration.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-auto pt-3 text-xs text-muted">
        {template.sourceName ? `${template.sourceName} · ` : ""}
        {when}
      </p>
    </article>
  );
}

export function TemplateGrid({ templates }: { templates: TemplateView[] }) {
  if (templates.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-card px-4 py-8 text-sm text-muted">Nenhum template nessa página ainda.</p>;
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <li key={template.slug}>
          <TemplateCard template={template} />
        </li>
      ))}
    </ul>
  );
}
