"use client";

import { useState } from "react";

const PLANS = [
  { value: "semana", label: "Barra + newsletter (R$ 150/semana)" },
  { value: "destaque", label: "Destaque na categoria (R$ 49/mês)" },
  { value: "ambos", label: "Os dois" },
];

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/sponsor-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          plan: data.get("plan"),
          message: data.get("message"),
          company_website: trap,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(body.error || "Não deu para enviar agora.");
        return;
      }
      setStatus("ok");
      setMessage(body.message || "Recebemos. Respondemos por e-mail.");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Sem conexão. Tente de novo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <label className="text-sm font-medium">
        Nome
        <input name="name" required className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-3 text-base" />
      </label>
      <label className="text-sm font-medium">
        E-mail
        <input name="email" type="email" required autoComplete="email" className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-3 text-base" />
      </label>
      <label className="text-sm font-medium">
        Plano
        <select name="plan" required defaultValue="semana" className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-3 text-base">
          {PLANS.map((plan) => (
            <option key={plan.value} value={plan.value}>
              {plan.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Mensagem
        <textarea name="message" required minLength={8} rows={4} className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2 text-base" />
      </label>
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden value={trap} onChange={(event) => setTrap(event.target.value)} />
      <button type="submit" disabled={status === "sending"} className="min-h-11 rounded-full bg-clay px-5 text-sm font-semibold text-white disabled:opacity-60">
        {status === "sending" ? "Enviando…" : "Fale com a gente"}
      </button>
      {message ? (
        <p role="status" className={`text-sm ${status === "error" ? "text-clay" : "text-teal"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
