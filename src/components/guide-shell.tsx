import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { DISCLAIMER } from "@/lib/config";

export type GuideLink = { href: string; title: string; note?: string };
export type GuideSource = { href: string; label: string };
export type GuideFaq = { question: string; answer: string };

export function GuideShell({
  title,
  description,
  children,
  related,
  sources,
  faqs,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  related: GuideLink[];
  sources: GuideSource[];
  faqs: GuideFaq[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-6">
      <p className="text-sm text-muted">
        <Link href="/" className="hover:text-teal">
          Início
        </Link>
        {" · "}
        <Link href="/comece-aqui" className="hover:text-teal">
          Comece aqui
        </Link>
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">{description}</p>
      <p className="mt-3 text-sm text-muted">{DISCLAIMER}</p>
      <article className="mt-8 space-y-4 text-[15px] leading-7 text-ink-soft">{children}</article>
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Templates deste assunto</h2>
        <ul className="mt-3 space-y-2">
          {related.map((item) => (
            <li key={item.href} className="rounded-2xl bg-card px-4 py-3 ring-1 ring-line">
              <Link href={item.href} className="font-semibold text-teal">
                {item.title}
              </Link>
              {item.note ? <p className="mt-1 text-sm text-muted">{item.note}</p> : null}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8 rounded-2xl bg-card px-4 py-4 text-sm ring-1 ring-line">
        <h2 className="font-display text-xl text-ink">Fontes</h2>
        <p className="mt-2 text-muted">Preços e limites conferidos em novembro de 2026. Confira a página oficial antes de pagar.</p>
        <ul className="mt-3 space-y-2">
          {sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} className="text-teal underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-2xl text-ink">Perguntas frequentes</h2>
        <div className="mt-3 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-ink">{faq.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }} />
      <SignupForm />
    </main>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-4 font-display text-2xl text-ink">{children}</h2>;
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl bg-ink px-4 py-3 text-sm leading-relaxed text-paper">
      <code>{children}</code>
    </pre>
  );
}
