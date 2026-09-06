# TODO — things only Vincent can answer

Every item below is also marked `TODO(vincent)` in the file it lives in. Facts in BRIEF §2 were followed as written; these are the places the brief itself says "verify", "assumed", or "Vincent supplies".

## Facts to confirm

1. **Certificate composition** — `src/data/program.json` (`ladder[].courses`), `src/content/courses/*.md` (`countsToward`), `src/pages/pathway.astro`, `src/pages/counselors.astro`
   Assumed per BRIEF §2: AI Literacy = AI 40 + AI 45; AI Fluency = AI 40, 45, 60, 65; the 18-unit certificate = all six AI courses. Shown as fact on the site; confirm or correct.

2. **Whether the 6-unit Certificate of Accomplishment is transcripted** — `src/pages/pathway.astro` (`transcripted()`)
   Displayed as "To be confirmed" on the Pathway page.

3. **Approved degree requirements beyond the six AI courses** — `src/data/program.json` (`supportingCourses`), `src/pages/pathway.astro`, `src/pages/counselors.astro`
   Only COSP 38, CS 31 and COSN 250 (CORs on file) plus "general education (15 units)" are listed, with a note that these are the courses with outlines on file.

4. **Recommended preparation for AI 70** — `src/content/courses/ai-70.md` (`recommendedPreparation`, `recommendedPreparationConfirmed`)
   Displayed as "To be confirmed" until the flag is set to `true`.

5. **Recommended preparation for AI 45** — `src/content/courses/ai-45.md`
   The brief lists recommended preparation only for AI 60, 65 and 80. AI 45 is shown as "To be confirmed"; set the flag to `true` (with "None" or the right course) once checked.

6. **LBCC catalog URL for the program** — `src/data/program.json` (`catalogUrl`)
   Currently `https://www.lbcc.edu/catalog`. Replace with the direct program/catalog link.

## Content to supply

7. **Contact email / where "Request info" goes** — `src/data/program.json` (`contactEmail`)
   Placeholder `TODO-vincent@lbcc.edu` is visible on the site and is the target of every "Request info" and contact mailto. Replace with your LBCC email.

8. **"Tools you'll use" list, per course** — `src/content/courses/*.md` (`tools`, `toolsConfirmed`)
   Placeholder lists of no-code/low-code tools. Edit the list and set `toolsConfirmed: true` to remove the "set by the instructor each term" note.

9. **"What you'll build" deliverables, per course** — `src/content/courses/*.md` (`build`)
   Drafted from the CORs, three per course. Edit freely.

10. **Plain-spoken course overviews** — body text of `src/content/courses/*.md`
    Paraphrased from the CORs. The verbatim catalog description sits in the frontmatter (`catalogDescription`) and renders in the "Catalog description" block.

## Assets

11. **Hero videos (six)** — drop into `public/video/` as `ai-40.mp4`, `ai-40.webm`, `ai-40.jpg` (poster), etc., then set `video: true` in each course's frontmatter. Prompts are in BRIEF §9. Until then the hero shows the animated gradient with a "Hero video coming soon" tag.

12. **Student work showcase** — `src/pages/courses/[slug].astro` ships the section hidden (`data-showcase="empty"`). Remove the attribute when there is work to show.

## Deployment

13. **Domain** — when registered: set `site` to the domain and `base` to `'/'` in `astro.config.mjs`, add `public/CNAME` with the domain, configure DNS, and turn on "Enforce HTTPS" in the repo's Pages settings.

14. **GitHub Pages source** — done. Source is set to "GitHub Actions" in the repo settings; every push to `main` redeploys. Live at https://vrcalip-pixel.github.io/ai-program-site/

## Later passes (not started)

- Pass two: hands-free mode (BRIEF §10), on a branch, opened as a pull request.
- Labor-market framing on the employers page, only with citations (LA/OC COE, BLS OEWS, CA EDD, Lightcast; APA 7).
- "Request info" form, if a mailto stops being enough.
