# dandelion.dk

Website for Dandelion (CVR 46566696). Plain HTML, no build step.

Every push to `main` deploys to https://dandelion.dk through Cloudflare Pages.

- `index.html`: the whole page, styles included
- `fonts/`: Schibsted Grotesk, self-hosted so visitors' IP addresses are not sent to Google (SIL Open Font License, see `fonts/OFL.txt`)
- `_headers`: security headers that Cloudflare Pages adds to every response
