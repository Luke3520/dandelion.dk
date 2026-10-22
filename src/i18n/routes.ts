export type Locale = 'da' | 'en';

// Pages that exist in both languages. Used for the language switcher and hreflang links.
// A page with no English twin links the switcher to the English home page instead.
export const routes = {
  home: { da: '/', en: '/en/' },
  services: { da: '/ydelser/', en: '/en/services/' },
  about: { da: '/om/', en: '/en/about/' },
  vega: { da: '/vega/', en: '/en/vega/' },
  contact: { da: '/kontakt/', en: '/en/contact/' },
  privacy: { da: '/privatlivspolitik/', en: '/en/privacy/' },
  thanks: { da: '/tak/', en: '/en/thanks/' },
} as const;

export type RouteKey = keyof typeof routes;

export function path(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}
