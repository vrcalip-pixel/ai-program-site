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
| Hero videos | drop `ai-nn.mp4`, `ai-nn.webm`, `ai-nn.jpg` into `public/video/`, then set `video: true` in that course's frontmatter |

Course frontmatter is validated by `src/content.config.ts`; a typo in a field name fails the build with a clear message.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL it prints (the site is served under `/ai-program-site/` to match GitHub Pages).

`npm run build` produces `dist/`. `npm run og` regenerates `public/og.png`.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages. When the program domain is registered, change `site` and `base` in `astro.config.mjs`, add `public/CNAME`, and enforce HTTPS in the repository's Pages settings.
