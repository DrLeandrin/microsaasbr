import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata(
  "Enviar template",
  "Mande um template n8n com a URL da fonte ou o JSON. A gente revisa antes de publicar.",
  "/enviar",
);

export default function EnviarPage() {
  return (
    <main id="conteudo" className="mx-auto max-w-xl px-4 py-6">
      <h1 className="font-display text-3xl leading-tight">Enviar um template</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Manda o link da fonte ou o JSON exportado. A gente revisa antes de publicar e não rehospeda o arquivo sem licença clara.
      </p>
      <SubmitForm />
    </main>
  );
}
