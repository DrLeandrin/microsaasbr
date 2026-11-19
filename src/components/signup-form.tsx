"use client";

import { useState } from "react";
import { NEWSLETTER_PITCH } from "@/lib/config";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company_website: trap }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Não deu para entrar na lista agora.");
        return;
      }
      setStatus("ok");
      setMessage(data.message || "Pronto. Terça que vem as 5 automações chegam nesse e-mail.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Sem conexão. Tente de novo.");
    }
  }

  return (
    <section className="mt-12 rounded-3xl bg-ink px-5 py-6 text-paper">
      <h2 className="font-display text-2xl leading-tight">{NEWSLETTER_PITCH}</h2>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="signup-email">
          E-mail
        </label>
        <input
          id="signup-email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@empresa.com.br"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-11 flex-1 rounded-full border border-white/10 bg-white px-4 text-base text-ink"
        />
        <input
          className="honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
          name="company_website"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-11 rounded-full bg-clay px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "sending" ? "Enviando…" : "Quero receber"}
        </button>
      </form>
      {message ? (
        <p role="status" className={`mt-3 text-sm ${status === "error" ? "text-clay-soft" : "text-paper/80"}`}>
          {message}
        </p>
      ) : null}
    </section>
  );
}
