# AI for Digital Transformation — program site

Program website for the A.S. in AI for Digital Transformation at Long Beach City College. Built with Astro and Tailwind, deployed to GitHub Pages by GitHub Actions on every push to `main`.

- `BRIEF.md` is the source of truth for facts and scope.
- `prototype-depth.html` is canonical for the landing page's look and motion; `prototype-map.html` is reference only.
- `TODO.md` lists everything that still needs Vincent's answer.

## Editing content

You do not need to touch components to change what the site says.

| What | Where |
|---|---|
| A course page (description, deliverables, tools, facts) | `src/content/courses/ai-40.md` … `ai-80.md` |
| Program facts (codes, people, credential ladder, contact email, catalog link) | `src/data/program.json` |
| Pathway, counselors, employers, about pages | `src/pages/pathway.astro`, `counselors.astro`, `employers.astro`, `about.astro` |
| The landing map's node text | `src/components/DepthMap.astro` (the `NODES` list) |
| The request-info form backend (sheet + email) | `scripts/apps-script/Code.gs`, setup in `FORM-SETUP.md`, endpoint in `src/data/program.json` |
| Hero videos | drop `ai-nn.mp4`, `ai-nn.webm`, `ai-nn.jpg` into `public/video/`, then set `video: true` in that course's frontmatter |

Course frontmatter is validated by `src/content.config.ts`; a typo in a field name fails the build with a clear message.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL it prints (the site is served under `/ai-program-site/` to match GitHub Pages).

`npm run build` produces `dist/`. `npm run og` regenerates `public/og.png`.

## Deployment and domain

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`. The site lives at https://aifordigitaltransformation.org (Namecheap). GitHub Pages needs, at Namecheap: four `A` records on `@` pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and a `CNAME` record on `www` pointing to `vrcalip-pixel.github.io`. In the repository's Settings → Pages, the custom domain is set to `aifordigitaltransformation.org` with "Enforce HTTPS" on. If the domain ever moves, change `site` in `astro.config.mjs` and `public/CNAME`.
