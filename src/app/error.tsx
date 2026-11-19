"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="conteudo" className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-3xl">Algo quebrou por aqui</h1>
      <p className="mt-2 text-sm text-muted">Tente de novo em instantes. Se continuar, a gente já ficou sabendo.</p>
      <button type="button" onClick={() => reset()} className="mt-4 min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper">
        Tentar de novo
      </button>
    </main>
  );
}
