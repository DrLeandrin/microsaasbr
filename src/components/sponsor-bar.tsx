"use client";

import { useSyncExternalStore } from "react";

const KEY = "n8nbr-sponsor-bar-closed";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function closedOnClient() {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function closeBar() {
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    // Ignore private-mode storage failures and still hide the bar.
  }
  listeners.forEach((listener) => listener());
}

export function SponsorBar({ href, label }: { href: string; label: string }) {
  const closed = useSyncExternalStore(subscribe, closedOnClient, () => false);
  if (closed) return null;
  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 text-sm">
        <a href={href} className="min-w-0 flex-1 truncate font-medium underline-offset-2 hover:underline">
          {label}
        </a>
        <button
          type="button"
          onClick={closeBar}
          aria-label="Fechar aviso"
          className="shrink-0 rounded-full px-3 py-2 text-paper/80 hover:bg-white/10"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
