# Start here — handing the build to Claude Code

## What's in the package

- `BRIEF.md` — everything Claude Code needs. Site map, facts that must be accurate, design system, landing-page spec, course content from the CORs, other pages, accessibility, hero-video prompts, hands-free spec, stack.
- `prototype-depth.html` — the approved landing page. Canonical.
- `prototype-map.html` — the flat map. Reference for the Pathway page.

## Steps (about 15 minutes of your time, then it runs)

1. Create a new, empty GitHub repository. Any name; the domain comes later.
2. Clone it to your computer. Copy the three files above into the repo root and commit.
3. Install Claude Code (desktop app) if you haven't. Open the repo folder in it.
4. Paste this as your first message:

> Read BRIEF.md in full, then open prototype-depth.html and prototype-map.html in a browser and study how they behave before writing any code. Then build pass one exactly as §12 describes: Astro + Tailwind scaffold, port the landing page from prototype-depth.html without redesigning it, build the six course pages and the four content pages from §6–7 using the CORs' descriptions, mark every unverified fact with TODO(vincent) and collect them in TODO.md, set up GitHub Pages deployment via Actions, and push. Commit often with plain-English messages. When the site is live, tell me the URL and list the TODOs.

5. Let it work. It will ask before anything irreversible.

## Reviewing while you're away

Claude Code and Cowork can be checked from the Claude mobile app — you can read progress, answer its questions, and approve or redirect from your phone. The deployed GitHub Pages URL is your review surface: open it on mobile, note what to change, and send those notes as the next message. Search Anthropic's docs for the current setup steps for remote access; they change.

## Things only you can answer (also listed as TODO(vincent) in the build)

- Confirm AI Literacy = AI 40 + 45 and AI Fluency = AI 40, 45, 60, 65.
- The approved degree requirements beyond the six AI courses.
- Recommended preparation for AI 70.
- The "Tools you'll use" list per course.
- Where "Request info" should go (mailto for now).
- Domain name, when chosen.

## After pass one

- Generate the six hero videos (prompts in BRIEF §9) and drop them in `/public/video/`.
- Start pass two: hands-free mode (BRIEF §10), on a branch, reviewed as a pull request.
