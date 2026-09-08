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
| People on the About page (bio, photo, links; add future faculty here) | `src/data/people.json`, photos in `public/people/` |
| Pathway, counselors, employers, about pages | `src/pages/pathway.astro`, `counselors.astro`, `employers.astro`, `about.astro` |
| The landing map's node text | `src/components/DepthMap.astro` (the `NODES` list) |
| The request-info form backend (sheet + email) | `scripts/apps-script/Code.gs`, setup in `FORM-SETUP.md`, endpoint in `src/data/program.json` |
| Previous/next tile backgrounds on course pages | `node scripts/tile-image.mjs <still> ai-nn` writes `public/tiles/ai-nn.jpg` from the still the hero was made from (the hero script writes one from the video's poster frame by default) |
| Hero videos | `node scripts/hero-video.mjs <clip.mp4> ai-nn` writes `public/video/ai-nn.{mp4,webm,jpg}` as a crossfaded loop (needs ffmpeg on PATH or `FFMPEG=`), then set `video: true` in that course's frontmatter |
| "Ask the program" answers | `src/data/faq.json` |
| "Where are you on the ladder?" (pathway checklist) | nothing to edit: it reads `program.json` and the course files |
| Labor-market dashboard on the employers page (figures, sources, APA 7 references) | `src/data/labor.json`; the component `src/components/LaborDashboard.astro` renders it and builds the reference list from the same file |
| Structured data (JSON-LD for search engines) | `src/lib/schema.ts`; values come from `program.json` and the course files |
| Counselor page hero video | `public/video/counselors.{mp4,webm,jpg}`, encoded with `node scripts/hero-video.mjs <clip.mp4> counselors` (ignore the script's closing note about `video: true`; delete the tile it writes to `public/tiles/`); markup at the top of `src/pages/counselors.astro` |
| Industry credentials (IBM, Microsoft, Google, OpenAI, Anthropic, AWS) on the counselor page | `src/data/credentials.json`; rendered by `src/components/IndustryCredentials.astro` |
| Sample plans on the counselor page (certificates, degree, GE, electives) | `src/data/plans.json`; rendered by `src/components/Plans.astro` |
| Hands-free gesture thresholds | `TUNE` at the top of the script in `src/components/HandsFree.astro` (see below) |

Course frontmatter is validated by `src/content.config.ts`; a typo in a field name fails the build with a clear message.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL it prints.

`npm run build` produces `dist/`. `npm run og` regenerates `public/og.png`. Before `dev` and `build`, `scripts/copy-mediapipe.mjs` copies the MediaPipe WASM runtime from `node_modules` into `public/mediapipe/` (gitignored), so the site serves it itself.

## Hands-free control

The Experience button on the map turns on sound, richer visuals and camera control (BRIEF §10). Hand tracking runs in the browser with MediaPipe Tasks Vision; the library is bundled from npm, the WASM is served from this site, and the model file is fetched from Google's model bucket the first time Experience is switched on. No video leaves the device.

Five gestures: point (the index fingertip drives the cursor), hold (rest on a node or button for just over half a second; a ring fills, then it activates), an open hand swept to your left (next course; judged on the palm centre from the moment the hand is in view, and a frame or two of not-quite-open is forgiven), a fist kept in place for 0.7 s (back; a swipe right collided with the hand returning after a swipe left) and a pull back (reset: an open palm held toward the camera, then drawn away while closing into a fist; judged on hand size, wrist to middle-finger base, which shrinks with distance, so the fist must be 30% smaller than the palm was; the map returns to its starting view, the same as the Recenter button). Back and pull are exclusive: a fist that drifts or changes size cannot become a back until the hand reopens, and a pull needs a size drop far past that tolerance. The earlier throw-aside detector stays in the library, unwired. The interpretation is in `src/lib/gestures.ts` with unit tests in `tests/`; run them with `npm test`.

Tuning from real use:

- Open the map with `?hf=debug` to see a small overlay with the frame rate, cursor position and speed, what is under the cursor, hold progress, and the last recognised gesture. `?hf=nodebug` hides it again (the choice is remembered on that device).
- Every threshold is in the `TUNE` object at the top of the script in `src/components/HandsFree.astro`, each with a comment. To try values without a rebuild, set `localStorage.hf.tune` in the browser console to a JSON object with the keys to override, for example `localStorage.setItem('hf.tune', '{"dwellMs":1200}')`, then turn Experience off and on. Once a value feels right, change it in `TUNE`.
- If the device tracks under 15 frames a second, camera control turns itself off with a one-line notice; sound and visuals stay on.

## Printing

Content pages (pathway, counselors, employers, about, courses) have a print stylesheet: dark ink on white, no navigation chrome, external links print their address. Counselors can print the counselor page as a one-sheet.

## Deployment and domain

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`. The site lives at https://aifordigitaltransformation.org (Namecheap). GitHub Pages needs, at Namecheap: four `A` records on `@` pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and a `CNAME` record on `www` pointing to `vrcalip-pixel.github.io`. In the repository's Settings → Pages, the custom domain is set to `aifordigitaltransformation.org` with "Enforce HTTPS" on. If the domain ever moves, change `site` in `astro.config.mjs` and `public/CNAME`.
