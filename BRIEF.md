# BRIEF — Program website for the A.S. in AI for Digital Transformation

Long Beach City College · Computer & Office Studies · Faculty author and program lead: Prof. Vincent Calip

This document is the source of truth for building the site. Two prototype files ship alongside it and are **canonical for look, motion, and interaction**:

- `prototype-depth.html` — the approved landing page (depth pathway). Port its behavior; do not redesign it.
- `prototype-map.html` — the earlier flat-map version. Reference only, for the Pathway page and for anything the depth file lacks.

Where the brief and the prototypes disagree on visual or interaction details, the prototypes win. Where they disagree on facts about the program, this brief wins.

---

## 1. Purpose and audiences

The site exists because the program is hard to explain and hard to point people to. It sits outside lbcc.edu on its own domain (to be registered; program-branded, not college-branded) and lbcc.edu will link to it.

Three audiences, in priority order for the landing page: **prospective students**, then **counselors and advisors**, then **employers and partners**. The landing page speaks to students; the other two get their own pages one click away.

Primary job of the site right now: **inform**. No hard call to action yet. "Request info" is a mailto for now; a form may come later.

Voice: professional, applied, workforce-focused, human-centered. Ethics-first, no-code/low-code, equity-minded. No hype. Plain verbs, sentence case.

---

## 2. Facts that must be accurate everywhere

These are the places a public site gets a college in trouble. Treat them as hard constraints.

**Credential ladder (show all four rungs, label status honestly):**

| Rung | Name | Units | Status label |
|---|---|---|---|
| Certificate of Accomplishment | AI Literacy | 6 | In development (expected to be offered no later than Spring 2027) |
| Certificate of Achievement | AI Fluency | 12 | In development |
| Certificate of Achievement | AI for Digital Transformation | 18 | Planned |
| A.S. Degree | AI for Digital Transformation | 60 | Approved (Chancellor's Office, March 26, 2026) |

- **Financial aid:** only the 18-unit certificate and the degree are Title IV eligible. The 12-unit certificate is a real transcripted credential but **must never be described as aid-eligible**. Put the aid note on the 18-unit rung only.
- **Certificate composition (confirmed by Vincent, September 5, 2026):** AI Literacy = AI 40 + AI 45. AI Fluency = AI 40, 45, 60, 65. The 18-unit certificate = all six AI courses.
- **Transcripted:** the 12-unit and 18-unit Certificates of Achievement and the degree are transcripted. Whether the 6-unit Certificate of Accomplishment is transcripted is still to be confirmed; the site shows "To be confirmed" until then.
- **Catalog:** link "full requirements" and any catalog reference to https://www.lbcc.edu/post/online-college-catalog.
- **Contact:** vcalip@lbcc.edu is the target of every "Request info" and contact link.
- **Transfer:** do **not** advertise UC transfer for any course. CORs currently show CSU-only for AI 40/45/60/65 and UC+CSU for AI 70/80; records are being corrected. Until then, say "CSU transferable" where transfer is mentioned at all, or say nothing.
- **Course numbers:** use `AI 40 … AI 80` only. The old `COSA` numbers appear only in the phrase "Formerly COSA nn" on course pages. Never as primary identifiers.
- **Supporting courses for the degree:** CORs on file for COSP 38 (Database Concepts), CS 31 (Intro to Computer Science–Python), COSN 250 (Cloud Computing in AWS). Any longer list is unverified — show only these three plus "general education (15 units)" until Vincent supplies the approved requirements.
- **People:** Department Head Miriam Lynch; School Dean Koby Moridzadeh. Do not name Gita Runkle anywhere.
- **Codes (About / counselor page only):** Plan Code 2150, Control #46279, CIP 11.0102, TOP 070210.

---

## 3. Site map

```
/                       Landing — the depth pathway (prototype-depth.html)
/courses/ai-40          AI and Machine Learning Foundations
/courses/ai-45          The Fundamentals of Generative AI
/courses/ai-60          Applied Conversational and Agentic AI
/courses/ai-65          Applied Multi-Modal AI
/courses/ai-70          Human–AI Collaboration and Workflow Automation
/courses/ai-80          Applied AI Integration Studio (capstone)
/pathway                The credential ladder in detail, degree requirements, aid note
/counselors             For counselors and advisors
/employers              For employers and partners
/about                  About the program, ethics-first statement, contact
```

Navigation bar (all pages): brand text top-left, "Request info" (mailto) and a hamburger menu top-right. Menu contents: Explore the map · Pathway · For counselors · For employers · About · Request info. **No course links in the menu** — the map is the course navigation; course pages link to each other via previous/next.

---

## 4. Design system (as built in the prototypes)

**Palette**

| Token | Hex | Use |
|---|---|---|
| plum (base) | `#0B1622` | page background (midnight blue — never black, never purple) |
| plum-2 | `#132434` | panels, cards |
| ink | `#EEF2F5` | primary text |
| ink-2 | `#9FB0BE` | secondary text |
| brass | `#D4A054` | courses, emphasis, status |
| glacier | `#6FA8BF` | credentials, network, secondary |
| deep | `#1E4A5F` | approved-rung gradients |

Only two accents. Restraint is the brand. No purple, no neon, no gradient text except the single hero line if reused.

**Type:** IBM Plex Serif (500/600) for headings; IBM Plex Sans (400/500/600) for body and UI. Google Fonts. Headings letter-spacing −0.012em, line-height 1.06.

**Surfaces:** frosted glass — `rgba(11,22,34,.28→.14)` gradient + `backdrop-filter: blur(14px) saturate(1.25)`, 1px hairline `rgba(238,242,245,.08)`. Nav bar and panels use this. Buttons are translucent "ghost" pills; the primary action is a solid ink pill with plum text.

**Motion principles:** one continuous idea per page, not scattered effects. Motion answers the user or reveals depth. Honor `prefers-reduced-motion` everywhere (static fallbacks are already in the prototypes). Keyboard focus visible (`3px solid brass`).

---

## 5. Landing page — the depth pathway

Port `prototype-depth.html` faithfully. Its behaviors, all of which must survive the port:

- Perspective projection (F = 1250). Nodes have `x, y, z`; AI 40 nearest, degree at the vanishing point. Size falls off with distance; far nodes cool toward `#6B87A0` and dim. Faint depth rings mark each course distance.
- Resting camera breathes (slow forward/back dolly + lateral sway) so depth is visible at rest.
- Layers, back to front: depth gradient → neural network (cursor-attracted) → stars (soft breathing halos) → comets (Experience only) → liquid sheen → links → pathway light → nodes → labels.
- **Click a node:** camera flies to it (node lands left of center, panel opens right). Panel: eyebrow, title, description, then three compact buttons — **‹ Back**, **See the course / Pathway / Open page**, **Deeper ›** — plus **Map** on small screens. Back/Deeper traverse all 13 destinations in depth order.
- **Scroll / arrows / swipe:** step through the same depth order. Scrolling back from the first stop returns to the overview.
- **Click empty space:** a displacement wave travels through world space (everything bends), with a visible liquid crest and star brightening.
- **Orbits:** credential and degree nodes show a dotted ring at distance and reveal orbiting course-number satellites on approach/hover/active. Labels draw above satellites with a soft shadow, never a stroke.
- **Experience** button: toggles ambient mode — synthesized four-chord pad, darker base with warm/teal fields, vignette, and occasional comets (three variants: crossing, receding, approaching) each with a laser-like descending tone through a synthesized reverb. Off by default. Button text never changes; pressed state is a slightly brighter fill. `aria-label` mentions sound.
- **Recenter** returns to the overview.
- Below 820px: nav collapses (Request info hidden, menu stays), panel docks to the bottom with a Map button, hud text hides when a node is open, zoom is scaled to the viewport so neighbors stay in frame.
- A visually hidden list of all destinations exists for screen readers. Every destination is also reachable via the menu or course-page links — the map is never the only route.

Links: course nodes → `/courses/ai-nn`; credential nodes → `/pathway#<rung>`; counselors/employers/about → their pages.

Known bugs already fixed in the prototype (don't reintroduce): ripple values must be initialized before first draw; ripple age must clamp at 0 (frame timestamps can precede `performance.now()` at click).

---

## 6. Course page template

Route: `/courses/ai-nn`. Hero video owns the screen (see §9). Layout: hero → two columns (content 2fr, sticky facts panel 1fr) → footer with previous/next course.

Sections in order:

1. **Hero:** eyebrow "AI nn · Formerly COSA mm", title, chips (3 units · prerequisites: none · counts toward <certificate>).
2. **What this course is** — the catalog description, lightly plain-spoken (below).
3. **What you'll build** — 3 concrete deliverables. Draft from the CORs; Vincent edits.
4. **Tools you'll use** — no-code/low-code tools as chips. Placeholder list; Vincent supplies.
5. **Student work** — showcase section, shipped hidden (`data-showcase="empty"`) until there is student work. Do not remove; it becomes the centerpiece later.
6. **Facts panel (sticky):** Units 3 · Hours 54 lecture · Recommended preparation · Grading: Student choice · Transfer: CSU. Links: Next course, Where this fits (Pathway).

All six: 3 units, 54 lecture hours, max 40 students, Student Choice grading, no prerequisites. Recommended preparation from the CORs: AI 65 recommends AI 45; AI 80 recommends AI 70; AI 60 recommends AI 45 (noncredit twin lists AI 45 or AI 645); AI 70 recommends AI 60. AI 40 and AI 45 have none (the AI 45 COR says Not Applicable). Confirmed by Vincent, September 5, 2026.

### Course descriptions (from the approved CORs — use verbatim in a "catalog description" block, paraphrase for the plain-spoken overview)

**AI 40 · AI and Machine Learning Foundations** (Formerly COSA 55)
Introduces foundational AI and ML principles for workplace application in business, marketing, education, and healthcare. AI history, types of AI, machine learning basics, real-world applications, ethical considerations. Students analyze AI-powered tools and develop skills in evaluating AI technologies for responsible, effective professional use.
Outcomes: evaluate foundational AI/ML concepts, applications and ethics to make appropriate decisions for use; utilize AI-powered tools to assess, optimize and enhance workplace processes.

**AI 45 · The Fundamentals of Generative AI** (Formerly COSA 60)
Theoretical knowledge and practical generative-AI skills. Outcomes: analyze and apply core AI concepts and techniques; develop advanced prompt-engineering skills (construct, innovate, critique and refine prompts); evaluate ethical and societal implications, including bias and data privacy.

**AI 60 · Applied Conversational and Agentic AI** (Formerly COSA 65)
Design and application of conversational and agentic AI systems: natural-language interaction, multi-turn dialogue, autonomous task completion. Using no-code and low-code platforms, learners design, test and deploy conversational assistants, workflow agents and domain-specific applications. Human-centered design, ethics, responsible deployment across business, education, customer service and healthcare. Portfolio project: a functional AI agent or assistant.

**AI 65 · Applied Multi-Modal AI** (Formerly COSA 67)
Applied systems integrating text, images, audio and video. Using no-code and low-code tools, students design, test and deploy multi-modal prototypes such as image captioning, cross-modal search and voice-enabled assistants. Workforce applications, ethical design, human-centered innovation. Culminates in a portfolio-ready applied project.

**AI 70 · Human–AI Collaboration and Workflow Automation** (Formerly COSA 69)
Design and implementation of human–AI collaborative workflows and automation. Integrate LLMs, multi-modal tools and productivity applications to streamline real processes. Task design, agent orchestration, retrieval-augmented generation (RAG), human-in-the-loop evaluation. Ethical, reliable, equitable automation for business, education and community applications.

**AI 80 · Applied AI Integration Studio** (Formerly COSA 75) — capstone
Advanced project-based capstone: design, develop and present an integrated AI solution demonstrating mastery of generative, conversational and multi-modal systems. Teams or individuals analyze a real-world problem, develop an applied AI workflow, deploy a functional prototype with no-code/low-code tools. Ethical design, human–AI collaboration, system integration, professional documentation and analytics. Final portfolio and presentation for workforce or community impact.

---

## 7. Other pages — content outline

**/pathway** — The ladder as a vertical, plain layout (reuse the four-rung visual from `prototype-map.html`, statuses as in §2). For each rung: what it is, which courses, whether it's transcripted, aid eligibility (18-unit and degree only). Degree section: the six AI courses + supporting courses on file (COSP 38, CS 31, COSN 250) + general education 15 units + "full requirements: see the LBCC catalog" link. The no-code / no-prerequisite message lives here in full. Anchors: `#literacy`, `#fluency`, `#certificate-18`, `#degree`.

**/counselors** — Everything needed to place a student: plan code and codes (§2), unit totals, recommended sequence (40 → 45 → 60/65 → 70 → 80), no prerequisites, grading, CSU transfer note, which certificate each course counts toward, who to contact (Vincent's LBCC email), link to the catalog. Tone: direct, tabular where it helps.

**/employers** — What graduates can do (drawn from the six course outcomes: evaluate AI tools; prompt and direct generative systems; build assistants and agents; produce multi-modal deliverables; automate workflows with human oversight; scope and deliver an integrated solution). Invitation to the advisory board; internship and project partnerships; contact. Labor-market framing may be added later and must cite LA/OC COE, BLS OEWS, CA EDD, Lightcast (APA 7). Do not invent statistics.

**/about** — Why the program exists; ethics-first statement (the blockquote from `prototype.html` v5: "The question isn't whether AI can do it. It's whether it should, who it affects, and who's accountable when it's wrong." plus bias/fairness, privacy/consent, human oversight); no-code positioning; faculty author; department and school; approval date; "program site maintained by program faculty; official catalog information lives at lbcc.edu" disclaimer; contact.

---

## 8. Accessibility and quality floor

- WCAG 2.1 AA: text contrast on every surface including lit ambient mode; focus visible; all controls keyboard-reachable; `prefers-reduced-motion` respected (static hero, no dolly, no wave, no comets).
- The map is an exploration layer. Every page is reachable without it (menu, footer, course prev/next). Screen-reader destination list present.
- Audio and camera never start without an explicit user action. Experience is opt-in and labeled as involving sound.
- Mobile: portrait works; no "rotate your device" gate. Lighthouse performance ≥ 85 on mobile for course pages; landing page may be lower but must not jank on a mid-range phone (reduce node/star counts below 820px as the prototype does).
- Semantic HTML, one `<h1>` per page, descriptive titles and meta descriptions, Open Graph image.

---

## 9. Hero videos (six, one per course)

Generate short loops (6–10 s, seamless), 16:9, MP4 + WebM, muted autoplay loop, `playsinline`, poster image fallback, lazy-loaded. Palette must match §4 — midnight, brass, glacier; abstract, no text, no faces, no logos. Use `<video>` not GIF.

Suggested prompts (Higgsfield or similar; Vincent will generate):

- **AI 40:** slow drift through a field of soft brass points of light forming and dissolving simple clusters; deep midnight blue; cinematic, abstract, calm.
- **AI 45:** ink-like brass and pale glacier strokes forming and reforming into shifting, half-recognizable shapes; generative, fluid, elegant.
- **AI 60:** two luminous threads in conversation — pulses passing back and forth along a glacier line, branching into small autonomous paths; dark background.
- **AI 65:** ribbons of four textures (grain of film, waveform, text glyph blur, pixel lattice) weaving into one braided stream; brass and glacier on midnight.
- **AI 70:** an orderly lattice of tasks lighting up in sequence with a single warm human-scaled glow moving along it, approving each step; calm, precise.
- **AI 80:** many small lights converging from all directions into one complex, slowly rotating structure; brass core, glacier periphery; the assembled whole.

---

## 10. Hands-free mode (build pass 2 — after the core site ships)

Opt-in **separate from Experience** (camera consent is its own decision). Button: "Hands-free" with `aria-label` "Turn on hands-free control (uses your camera; video stays on this device)". While active, show a persistent label: "Hands-free · camera stays on your device".

Stack: **MediaPipe Tasks Vision** (JS) — Hand Landmarker + Face Landmarker, WASM/GPU, in-browser, no server, no training. Requires HTTPS (GitHub Pages / custom domain qualify).

Gesture vocabulary (interpretation code on top of landmarks):

| Gesture | Action |
|---|---|
| Open hand raised | hand cursor appears; nodes highlight on hover |
| Pinch (thumb–index) | click: fly to node, or send wave through empty space |
| Palm pushed toward camera / pulled back | Deeper / Back (depth travel) |
| Two-finger horizontal swipe | Deeper / Back |
| Head turn | drives the parallax tilt (replaces cursor tilt) |
| Nod | Deeper; small head shake closes the panel |

Skip eye tracking (jittery, needs calibration). Mouse/keyboard/touch remain fully functional at all times — gesture control is additive, never required (WCAG). Graceful degradation: if the model fails to load or FPS < 15, show a one-line notice and turn the mode off. Never record, upload, or store frames.

Rationale worth stating on the About page when shipped: a Multi-Modal AI program whose site reads your hand and face is the program demonstrating its subject.

---

## 11. Stack and deployment

- **Astro** (static) + **Tailwind** for pages and layout; the landing canvas is vanilla JS ported from the prototype into a single component (do not rewrite it in a framework). Fonts via Google Fonts with `display=swap`.
- **Repo:** new, empty GitHub repo (name TBD). Deploy to **GitHub Pages** via GitHub Actions on push to `main`.
- **Domain:** aifordigitaltransformation.org, registered at Namecheap on September 5, 2026. DNS: four GitHub Pages `A` records on the apex and a `www` CNAME to `vrcalip-pixel.github.io`; custom domain set in the repo's Pages settings; `public/CNAME` in the repo; HTTPS enforced.
- Content in Markdown/JSON so Vincent can edit course pages without touching components.
- Commit early and often with plain-English messages; open a PR for pass 2 (hands-free) rather than merging straight to `main`.

---

## 12. Working agreement for Claude Code

1. Read this file, then open both prototype HTML files and run them in the browser before writing code.
2. Pass one = scaffold, port the landing page, build the six course pages and four content pages from §6–7, deploy to GitHub Pages. Placeholders are fine where the brief says "verify" or "Vincent supplies" — mark them visibly with `TODO(vincent):` in content files and list them in `TODO.md`.
3. Do not redesign. Do not introduce new colors, fonts, or motion. Do not soften or remove the accuracy constraints in §2.
4. Prefer shipping a working site with placeholders over a perfect site later. Vincent reviews from mobile; keep the deployed preview current.
5. Pass two = hands-free mode (§10), on a branch.
