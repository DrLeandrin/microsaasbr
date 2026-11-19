import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-3xl">Não achamos essa página</h1>
      <p className="mt-2 text-sm text-muted">O template ou a integração pode ter saído do diretório.</p>
      <Link href="/" className="mt-4 inline-block font-semibold text-teal">
        Voltar ao início
      </Link>
    </main>
  );
}
