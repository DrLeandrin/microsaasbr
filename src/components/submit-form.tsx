"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/catalog";

export function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("workflowFile");
    let workflowJson = "";
    if (file instanceof File && file.size > 0) {
      if (file.size > 500 * 1024) {
        setStatus("error");
        setMessage("O JSON passa de 500 KB.");
        return;
      }
      workflowJson = await file.text();
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          sourceUrl: data.get("sourceUrl"),
          workflowJson,
          description: data.get("description"),
          integrations: data.get("integrations"),
          category: data.get("category"),
          authorName: data.get("authorName"),
          email: data.get("email"),
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
      setMessage(body.message || "Recebemos. Vamos revisar antes de publicar.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Sem conexão. Tente de novo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <Field label="Nome do template" name="title" required />
      <Field label="URL da fonte" name="sourceUrl" type="url" placeholder="https://n8n.io/workflows/…" />
      <label className="text-sm font-medium">
        Ou o JSON exportado do n8n
        <input name="workflowFile" type="file" accept="application/json,.json" className="mt-1 block w-full text-sm" />
        <span className="mt-1 block text-xs font-normal text-muted">Até 500 KB. A gente guarda para revisar e só publica o link da fonte.</span>
      </label>
      <label className="text-sm font-medium">
        O que esse fluxo faz
        <textarea name="description" required minLength={8} rows={4} className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2 text-base" />
      </label>
      <Field label="Integrações" name="integrations" placeholder="WhatsApp, Mercado Pago, Bling" />
      <label className="text-sm font-medium">
        Categoria
        <select name="category" required defaultValue="" className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-3 text-base">
          <option value="" disabled>
            Escolha
          </option>
          {CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <Field label="Autor" name="authorName" required />
      <Field label="Seu e-mail" name="email" type="email" required autoComplete="email" />
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden value={trap} onChange={(event) => setTrap(event.target.value)} />
      <button type="submit" disabled={status === "sending"} className="min-h-11 rounded-full bg-clay px-5 text-sm font-semibold text-white disabled:opacity-60">
        {status === "sending" ? "Enviando…" : "Enviar para revisão"}
      </button>
      {message ? (
        <p role="status" className={`text-sm ${status === "error" ? "text-clay" : "text-teal"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1 min-h-11 w-full rounded-xl border border-line bg-card px-3 text-base"
      />
    </label>
  );
}
