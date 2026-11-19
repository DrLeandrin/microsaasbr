"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "Georgia, serif", background: "#f3f1ea", color: "#14202b", padding: 32 }}>
        <h1>Algo quebrou por aqui</h1>
        <button type="button" onClick={() => reset()}>
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
