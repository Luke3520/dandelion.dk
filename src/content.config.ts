import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cases are written in Danish. The optional English fields let the English home page show them.
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    titleEn: z.string().optional(),
    summaryEn: z.string().optional(),
    // Only set `client` and `named: true` once the client has agreed to be named.
    client: z.string().optional(),
    named: z.boolean().default(false),
    logo: z.string().optional(),
    pillar: z.enum(['hjemmesider', 'systemer', 'raadgivning']),
    status: z.enum(['live', 'i-gang']).default('live'),
    stack: z.array(z.string()).default([]),
    link: z.string().optional(),
    order: z.number().default(100),
  }),
});

const noter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noter' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// People. `team` marks the people named on the About page; everyone else appears on the Vega collaborators wall.
// `listed` stays false until the person has agreed to be shown on the site.
const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    roleEn: z.string().optional(),
    // The Markdown body is the Danish bio; this is the English one.
    bioEn: z.string().optional(),
    team: z.boolean().default(false),
    listed: z.boolean().default(false),
    link: z.string().optional(),
    order: z.number().default(100),
  }),
});

export const collections = { cases, noter, people };
