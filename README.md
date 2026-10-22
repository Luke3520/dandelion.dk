# dandelion.dk

Website for Dandelion (CVR 46566696). Built with [Astro](https://astro.build) as a static site with no client-side JavaScript, deployed on Cloudflare Pages.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
```

## Structure

- `src/pages/`: one file per page. Danish at `/`, English core pages under `/en/`.
- `src/components/`: section components (Hero, Section, CardGrid, CaseList, PricingTable, RequestForm, ...). The redesign replaces these and `src/styles/`, not the copy or routes.
- `src/styles/tokens.css`: colours, type scale, spacing. `global.css` has the base styles.
- `src/components/art/`: the illustrations. They are drawn as code with Rough.js when the site is built, so pages ship plain SVG and no JavaScript. `STYLE.md` there is the style guide every drawing follows; `src/lib/sketch.ts` and `src/lib/plants.ts` are the drawing helpers. Drawings for one page go in `SpotArt.astro`; pass one to a page hero with `slot="art"`.
- `src/content/`: Markdown collections.
  - `cases/`: one file per project. Set `named: true`, `client` and `logo` only after the client has agreed. The logo slideshow appears once four named clients have a logo.
  - `noter/`: posts. `draft: true` hides a post in production.
  - `people/`: team and Project Vega collaborators. `listed: false` keeps someone off the site until they have agreed.
- `src/data/prices.ts`: every published price.
- `src/site.ts`: e-mail, CVR, address, LinkedIn.
- `src/i18n/`: interface text and the Danish/English page pairs used for hreflang and the language switcher.
- `public/_headers`: security headers that Cloudflare Pages adds to every response. The CSP allows no scripts.
- `public/fonts/`: Schibsted Grotesk and Fraunces, self-hosted so visitors' IP addresses are not sent to Google (SIL Open Font License).
- `functions/api/request.ts`: Pages Function behind the contact and Project Vega forms.
- `migrations/`: D1 schema for the form submissions.

## Cloudflare setup

1. **Build settings** (Pages project → Settings → Build): framework preset Astro, build command `npm run build`, output directory `dist`. Node version comes from `.node-version`.
2. **Database:** create it in the EU and apply the schema:
   ```sh
   npx wrangler d1 create dandelion --jurisdiction eu
   npx wrangler d1 execute dandelion --remote --file migrations/0001_requests.sql
   npx wrangler d1 execute dandelion --remote --file migrations/0002_reach.sql
   ```
   Then bind it to the Pages project as `DB` (Settings → Bindings → D1 database).
3. **Variables** (Settings → Variables and secrets):
   - `IP_SALT`: any long random string (secret).
   - For e-mail notifications through Cloudflare Email Service: `CF_ACCOUNT_ID`, `CF_EMAIL_API_TOKEN` (an API token with "Email Sending: Edit", secret), `NOTIFY_FROM` (an address on dandelion.dk, e.g. `formular@dandelion.dk`) and `NOTIFY_TO` (where notifications go). Without these, submissions are still stored; only the e-mail is skipped.
4. **E-mail address:** set up Email Routing so `hej@dandelion.dk` forwards to Gmail, then change `email` in `src/site.ts`.

There is deliberately no `wrangler.toml`. With one in the repo, Pages would ignore the bindings set in the dashboard.

## Reading the backlog

```sh
npx wrangler d1 execute dandelion --remote --command "SELECT id, created_at, kind, name, email, topic, message FROM requests WHERE status = 'ny' ORDER BY created_at DESC"
npx wrangler d1 execute dandelion --remote --command "UPDATE requests SET status = 'besvaret' WHERE id = 1"
```

Requests are deleted automatically after 12 months and IP hashes after one day, as the privacy policy promises.

## Testing the forms locally

Copy `dist/`, `functions/` and `migrations/` to a scratch folder, add a `wrangler.toml` there with a D1 binding called `DB`, then run `npx wrangler d1 execute dandelion --local --file migrations/0001_requests.sql` (and the same for `0002_reach.sql`) followed by `npx wrangler pages dev`.
