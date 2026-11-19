const DISPOSABLE = new Set(
  `
10minutemail.com
10minutemail.net
1secmail.com
1secmail.net
1secmail.org
burnermail.io
byom.de
discard.email
dispostable.com
dropmail.me
emailfake.com
emailondeck.com
emailtemporario.com.br
fakeinbox.com
fakemail.net
generator.email
getairmail.com
getnada.com
grr.la
guerrillamail.biz
guerrillamail.com
guerrillamail.de
guerrillamail.info
guerrillamail.net
guerrillamail.org
guerrillamailblock.com
harakirimail.com
inboxkitten.com
mailcatch.com
maildrop.cc
mailforspam.com
mailinator.com
mailinator.net
mailinator.org
mailnesia.com
mailnull.com
mailpoof.com
mintemail.com
moakt.com
mohmal.com
mytemp.email
sharklasers.com
spam4.me
spamgourmet.com
spamgourmet.net
spamgourmet.org
temp-mail.io
temp-mail.org
tempail.com
tempinbox.com
tempmail.com
tempmail.com.br
tempmail.plus
tempmailo.com
tempr.email
throwaway.email
trash-mail.com
trashmail.com
trashmail.de
trashymail.com
yopmail.com
yopmail.fr
yopmail.net
`
    .trim()
    .split(/\s+/),
);

export function normalizeEmail(input: string) {
  return input.trim().toLowerCase();
}

/** Returns a person-facing reason, or null when the address can be stored. */
export function emailBlockReason(input: string) {
  const email = normalizeEmail(input);
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Informe um e-mail válido.";
  }
  const [local, domain] = email.split("@");
  if (!local || !domain) return "Informe um e-mail válido.";
  if (local === "test" || /^test([+._-]|$)/.test(local)) {
    return "Use um e-mail de verdade. Endereço de teste não entra.";
  }
  if (
    domain === "example.com" ||
    domain === "example.org" ||
    domain === "example.net" ||
    domain.endsWith(".example.com") ||
    domain.endsWith(".example.org") ||
    domain.endsWith(".example.net") ||
    domain.endsWith(".test") ||
    domain.endsWith(".invalid")
  ) {
    return "Esse domínio de e-mail não entra na lista.";
  }
  if (domain === "mailinator.com" || domain.endsWith(".mailinator.com") || DISPOSABLE.has(domain)) {
    return "E-mail temporário não entra na lista.";
  }
  return null;
}
