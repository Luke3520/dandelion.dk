import type { Locale } from '../i18n/routes';
import type { Card } from '../components/CardGrid.astro';

// "Sikker fra dag ét": what every project gets, whatever the pillar.
export const trust: Record<Locale, { title: string; intro: string; items: Card[] }> = {
  da: {
    title: 'Sikker fra dag ét',
    intro: 'Det her er ikke tilkøb. Det er sådan, vi bygger alt.',
    items: [
      { title: 'Tilgængelig', icon: 'access', text: 'Vi bygger efter WCAG 2.1 AA og tester med skærmlæser, ikke kun med et automatisk tjek.' },
      { title: 'Sikre standarder', icon: 'lock', text: 'Tofaktor-login, mindst mulige rettigheder og sikkerhedsheadere er slået til fra start.' },
      { title: 'Få tredjeparter', icon: 'eye', text: 'Vi sender ikke jeres besøgendes data videre, når det ikke er nødvendigt. Denne side har hverken cookies eller sporing.' },
      { title: 'Overblik', icon: 'list', text: 'I får skriftligt, hvad der kører hvor, hvem der har adgang, og hvad det koster.' },
    ],
  },
  en: {
    title: 'Secure from day one',
    intro: 'This is not an add-on. It is how we build everything.',
    items: [
      { title: 'Accessible', icon: 'access', text: 'We build to WCAG 2.1 AA and test with a screen reader, not just an automated check.' },
      { title: 'Safe defaults', icon: 'lock', text: 'Two-factor login, least privilege and security headers are switched on from the start.' },
      { title: 'Few third parties', icon: 'eye', text: 'We do not pass your visitors’ data on when it is not needed. This site has no cookies and no tracking.' },
      { title: 'Overview', icon: 'list', text: 'You get in writing what runs where, who has access, and what it costs.' },
    ],
  },
};
