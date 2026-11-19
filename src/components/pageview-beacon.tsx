"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageviewBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    void fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname || "/" }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);
  return null;
}
