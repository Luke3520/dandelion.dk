// Receives the contact and Project Vega forms, stores them in D1 and sends a notification e-mail.
// Bindings and variables are set in the Cloudflare Pages dashboard; see README.md.

interface Env {
  DB?: D1Database;
  IP_SALT?: string;
  // Cloudflare Email Service (REST API). Notifications are skipped if any of these are missing.
  CF_ACCOUNT_ID?: string;
  CF_EMAIL_API_TOKEN?: string;
  NOTIFY_FROM?: string;
  NOTIFY_TO?: string;
}

type Locale = 'da' | 'en';

const LIMITS = { name: 200, email: 320, organisation: 200, topic: 50, reach: 200, message: 5000 };
const MAX_PER_HOUR = 5;
const THANKS: Record<Locale, string> = { da: '/tak/', en: '/en/thanks/' };

const TEXT = {
  da: {
    invalid: 'Udfyld venligst navn, en gyldig e-mail og din besked.',
    consent: 'Du skal give samtykke, før vi kan gemme din henvendelse til Project Vega.',
    tooMany: 'Du har sendt mange beskeder på kort tid. Prøv igen senere, eller skriv direkte på e-mail.',
    unavailable: 'Formularen virker ikke lige nu. Skriv i stedet direkte på e-mail.',
    back: 'Gå tilbage',
  },
  en: {
    invalid: 'Please fill in your name, a valid email and your message.',
    consent: 'Please give your consent before we can store your Project Vega request.',
    tooMany: 'You have sent several messages in a short time. Please try again later or email us directly.',
    unavailable: 'The form is not working right now. Please email us directly instead.',
    back: 'Go back',
  },
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const form = await request.formData();
  const field = (name: keyof typeof LIMITS) => String(form.get(name) ?? '').trim().slice(0, LIMITS[name]);

  const locale: Locale = form.get('locale') === 'en' ? 'en' : 'da';
  const t = TEXT[locale];
  const kind = form.get('kind') === 'vega' ? 'vega' : 'contact';

  // Bots fill the hidden field. Pretend it worked so they don't retry.
  if (String(form.get('website') ?? '') !== '') return redirect(request, THANKS[locale]);

  const entry = {
    name: field('name'),
    email: field('email'),
    organisation: field('organisation') || null,
    topic: field('topic') || null,
    reach: field('reach') || null,
    message: field('message'),
    consent: form.get('consent') === 'yes' ? 1 : 0,
  };

  if (!entry.name || !entry.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
    return page(request, t.invalid, t.back, locale, 400);
  }
  if (kind === 'vega' && !entry.consent) return page(request, t.consent, t.back, locale, 400);
  if (!env.DB) return page(request, t.unavailable, t.back, locale, 503);

  const ipHash = await hash(`${env.IP_SALT ?? 'dandelion'}:${request.headers.get('CF-Connecting-IP') ?? ''}`);
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM requests WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
  )
    .bind(ipHash)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= MAX_PER_HOUR) return page(request, t.tooMany, t.back, locale, 429);

  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO requests (kind, locale, name, email, organisation, topic, reach, message, consent, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(kind, locale, entry.name, entry.email, entry.organisation, entry.topic, entry.reach, entry.message, entry.consent, ipHash),
    // Retention, as promised in the privacy policy: IP hashes after a day, requests after 12 months.
    env.DB.prepare("UPDATE requests SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND created_at < datetime('now', '-1 day')"),
    env.DB.prepare("DELETE FROM requests WHERE created_at < datetime('now', '-12 months')"),
  ]);

  waitUntil(notify(env, kind, entry));
  return redirect(request, THANKS[locale]);
};

export const onRequest: PagesFunction<Env> = async () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });

async function notify(env: Env, kind: string, entry: { name: string; email: string; organisation: string | null; topic: string | null; reach: string | null; message: string }) {
  if (!env.CF_ACCOUNT_ID || !env.CF_EMAIL_API_TOKEN || !env.NOTIFY_FROM || !env.NOTIFY_TO) return;
  const label = kind === 'vega' ? 'Project Vega' : 'Kontakt';
  const text = [
    `Ny henvendelse: ${label}`,
    '',
    `Navn: ${entry.name}`,
    `E-mail: ${entry.email}`,
    `Organisation: ${entry.organisation ?? '-'}`,
    `Emne: ${entry.topic ?? '-'}`,
    `Kontakt helst: ${entry.reach ?? '-'}`,
    '',
    entry.message,
  ].join('\n');
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.CF_EMAIL_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.NOTIFY_FROM,
        to: env.NOTIFY_TO,
        subject: `${label}: ${entry.name}`,
        text,
      }),
    });
    if (!res.ok) console.error('Notification failed', res.status, await res.text());
  } catch (err) {
    console.error('Notification failed', err);
  }
}

async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function redirect(request: Request, to: string): Response {
  return Response.redirect(new URL(to, request.url).toString(), 303);
}

function page(request: Request, message: string, back: string, locale: Locale, status: number): Response {
  // Link back to the form the visitor came from, but only on our own site.
  let backHref = '/';
  try {
    const referer = new URL(request.headers.get('Referer') ?? '');
    if (referer.origin === new URL(request.url).origin) backHref = referer.href;
  } catch {}
  const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Dandelion</title>
<style>body{font-family:system-ui,sans-serif;color:#1F2B1A;max-width:36rem;margin:4rem auto;padding:0 1.5rem;line-height:1.55;font-size:1.125rem}a{color:#1F2B1A;text-decoration-color:#F6C21B;text-decoration-thickness:.18em}</style></head>
<body><p>${escape(message)}</p><p><a href="${escape(backHref)}">${escape(back)}</a></p></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
