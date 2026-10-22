import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const hiddenFromSitemap = ['/tak/', '/en/thanks/'];

export default defineConfig({
  site: 'https://dandelion.dk',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({ filter: (page) => !hiddenFromSitemap.some((path) => page.endsWith(path)) }),
  ],
});
