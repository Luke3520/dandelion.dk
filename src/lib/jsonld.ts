import { site } from '../site';

export const organisation = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  email: site.email,
  vatID: `DK${site.cvr}`,
  address: {
    '@type': 'PostalAddress',
    postalCode: site.postalCode,
    addressLocality: site.city,
    addressCountry: 'DK',
  },
  areaServed: 'DK',
  sameAs: [site.linkedin],
};
