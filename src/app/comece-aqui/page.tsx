import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { DISCLAIMER, SITE_NAME } from "@/lib/config";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/meta";

const title = "Comece aqui: n8n para quem nunca usou";
const description =
  "Cinco guias curtos, em português, sobre o que é o n8n, onde hospedar, quanto custa, como conectar e o primeiro fluxo.";

export const metadata: Metadata = pageMetadata(title, description, "/comece-aqui");

const faqs = [
  {
    question: "Preciso pagar para ler os guias?",
    answer: "Não. Os cinco textos são públicos. A newsletter, se você quiser, também é gratuita.",
  },
  {
    question: "Os preços do guia são de hoje?",
    answer:
      "Foram lidos nas páginas oficiais em novembro de 2026, e cada número leva o link. Plano e promoção mudam. Antes de pagar, abra a fonte.",
  },
  {
    question: "O site é da empresa do n8n?",
    answer: "Não. É um projeto da comunidade, sem afiliação com a n8n GmbH.",
  },
];

export default function Page() {
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
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">Para quem está chegando</p>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">
        Cinco textos para sair do zero: o que é um fluxo, onde ele mora, quanto custa, como liga no WhatsApp e no Pix, e um
        template real importado em cerca de 15 minutos.
      </p>
      <p className="mt-3 text-sm text-muted">{DISCLAIMER} Este guia faz parte de {SITE_NAME}, um projeto da comunidade.</p>
      <ol className="mt-8 space-y-3">
        {GUIDES.map((guide, index) => (
          <li key={guide.href} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-line">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">0{index + 1}</p>
            <h2 className="mt-1 font-display text-2xl">
              <Link href={guide.href} className="hover:text-teal">
                {guide.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{guide.description}</p>
          </li>
        ))}
      </ol>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Perguntas frequentes</h2>
        <div className="mt-3 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold">{faq.question}</h3>
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
