export async function addToAudience(email: string) {
  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) return { skipped: true as const };
  const response = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (response.status === 409) return { skipped: false as const, id: null };
  if (!response.ok) throw new Error(`Resend audience ${response.status}`);
  const data = (await response.json().catch(() => ({}))) as { id?: string };
  return { skipped: false as const, id: data.id ?? null };
}

export async function notifyOwner(subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  const from = process.env.NOTIFY_FROM;
  if (!key || !to || !from) return { skipped: true as const };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) throw new Error(`Resend email ${response.status}`);
  return { skipped: false as const };
}
