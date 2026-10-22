import type { Locale } from '../i18n/routes';

// Published prices, excl. VAT. Change a number here and every page that shows it follows.
export const prices = {
  systemtjek: 3500,
  websiteSimple: 15000,
  websiteBusiness: 28000,
  careMonthly: 450,
  sparringHours: 10,
  sparringBlock: 7500,
};

export function kr(amount: number, locale: Locale): string {
  const n = new Intl.NumberFormat(locale === 'da' ? 'da-DK' : 'en-GB').format(amount);
  return locale === 'da' ? `${n} kr.` : `DKK ${n}`;
}

export interface PriceRow {
  name: string;
  what: string;
  price: string;
  note?: string;
  href?: string;
}

export function priceRows(locale: Locale): PriceRow[] {
  const p = prices;
  if (locale === 'da') {
    return [
      {
        name: 'Systemtjek',
        what: 'To timer sammen med os om jeres systemer, kasse, webshop, betaling eller en teknisk beslutning. Bagefter får I en skriftlig anbefaling.',
        price: kr(p.systemtjek, 'da'),
        note: 'Trækkes fra prisen, hvis I går videre med os.',
        href: '/ydelser/raadgivning/',
      },
      {
        name: 'Hjemmeside, Enkel',
        what: 'En overskuelig side med op til fem undersider, kontaktformular, grundlæggende SEO og tilgængelighed efter WCAG 2.1 AA.',
        price: `fra ${kr(p.websiteSimple, 'da')}`,
        href: '/ydelser/hjemmesider/',
      },
      {
        name: 'Hjemmeside, Erhverv',
        what: 'Flere undersider, struktur og tekst lavet sammen med jer, lokal SEO og plads til nyheder, cases eller booking.',
        price: `fra ${kr(p.websiteBusiness, 'da')}`,
        href: '/ydelser/hjemmesider/',
      },
      {
        name: 'Drift og vedligehold',
        what: 'Hosting, opdateringer, overvågning og små rettelser, så siden eller systemet bliver ved med at køre.',
        price: `fra ${kr(p.careMonthly, 'da')} pr. md.`,
      },
      {
        name: 'Sparring, klippekort',
        what: 'Til virksomheder med egne udviklere: second opinion, arkitektur, valg af leverandør og kodegennemgang.',
        price: `${p.sparringHours} timer: ${kr(p.sparringBlock, 'da')}`,
        href: '/ydelser/raadgivning/',
      },
      {
        name: 'Systemer og integrationer',
        what: 'Skræddersyede værktøjer og forbindelser mellem kasse, webshop, lager og bogføring.',
        price: 'Pris efter Systemtjek',
        href: '/ydelser/systemer/',
      },
      {
        name: 'Klart sprog',
        what: 'Tekster til hjemmesiden, der er lette at læse og forstå, også i en let-læst udgave.',
        price: 'Efter aftale',
        href: '/ydelser/hjemmesider/',
      },
    ];
  }
  return [
    {
      name: 'Systems check',
      what: 'Two hours with us on your systems, till, webshop, payments or a technical decision, followed by a written recommendation.',
      price: kr(p.systemtjek, 'en'),
      note: 'Deducted from the price if you go ahead with us.',
    },
    {
      name: 'Website, Simple',
      what: 'A clear site with up to five pages, a contact form, basic SEO and accessibility to WCAG 2.1 AA.',
      price: `from ${kr(p.websiteSimple, 'en')}`,
    },
    {
      name: 'Website, Business',
      what: 'More pages, structure and copy written with you, local SEO and room for news, cases or booking.',
      price: `from ${kr(p.websiteBusiness, 'en')}`,
    },
    {
      name: 'Hosting and care',
      what: 'Hosting, updates, monitoring and small fixes, so the site or system keeps running.',
      price: `from ${kr(p.careMonthly, 'en')} per month`,
    },
    {
      name: 'Advice, block of hours',
      what: 'For companies with their own developers: a second opinion, architecture, choosing a vendor and code review.',
      price: `${p.sparringHours} hours: ${kr(p.sparringBlock, 'en')}`,
    },
    {
      name: 'Systems and integrations',
      what: 'Custom tools and connections between till, webshop, stock and accounting.',
      price: 'Priced after a systems check',
    },
  ];
}
