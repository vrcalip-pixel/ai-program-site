# TODO — things only Vincent can answer

Every item below is also marked `TODO(vincent)` in the file it lives in. Facts in BRIEF §2 were followed as written; these are the places the brief itself says "verify", "assumed", or "Vincent supplies".

## Facts to confirm

1. **Certificate composition** — confirmed by Vincent, 2026-09-05. AI Literacy = AI 40 + AI 45; AI Fluency = AI 40, 45, 60, 65; the 18-unit certificate = all six AI courses.

2. **6-unit Certificate of Accomplishment** — status updated per Vincent, 2026-09-05: "In development", expected to be offered no later than Spring 2027 (BRIEF §2 said "Approved"; the site now follows Vincent). Still open: whether it is transcripted — `src/pages/pathway.astro` (`transcripted()`) shows "To be confirmed".

3. **Approved degree requirements beyond the six AI courses** — `src/data/program.json` (`supportingCourses`), `src/pages/pathway.astro`, `src/pages/counselors.astro`
   Only COSP 38, CS 31 and COSN 250 (CORs on file) plus "general education (15 units)" are listed, with a note that these are the courses with outlines on file.

4. **Recommended preparation for AI 70** — done. AI 60, per its COR (Vincent, 2026-09-05).

5. **Recommended preparation for AI 45** — done. None; the COR says Not Applicable (Vincent, 2026-09-05).

6. **LBCC catalog URL** — done. https://www.lbcc.edu/post/online-college-catalog (Vincent, 2026-09-05).

## Content to supply

7. **Contact email** — done. vcalip@lbcc.edu is the target of every Request info and contact link (Vincent, 2026-09-05).

8. **"Tools you'll use" list, per course** — `src/content/courses/*.md` (`tools`, `toolsConfirmed`)
   Placeholder lists of no-code/low-code tools. Edit the list and set `toolsConfirmed: true` to remove the "set by the instructor each term" note.

9. **"What you'll build" deliverables, per course** — `src/content/courses/*.md` (`build`)
   Drafted from the CORs, three per course. Edit freely.

10. **Plain-spoken course overviews** — body text of `src/content/courses/*.md`
    Paraphrased from the CORs. The verbatim catalog description sits in the frontmatter (`catalogDescription`) and renders in the "Catalog description" block.

## Assets

11. **Hero videos (six)** — drop into `public/video/` as `ai-40.mp4`, `ai-40.webm`, `ai-40.jpg` (poster), etc., then set `video: true` in each course's frontmatter. Prompts are in BRIEF §9. Until then the hero shows the animated gradient with a "Hero video coming soon" tag.

12. **Student work showcase** — `src/pages/courses/[slug].astro` ships the section hidden (`data-showcase="empty"`). Remove the attribute when there is work to show.

## Request-info form

15. **Form backend** — connected 2026-09-05 to an Apps Script on Vincent's personal Google account (interim). Later: recreate the Sheet and script under a school-facing account by repeating `FORM-SETUP.md` there, then replace `form.endpoint` in `src/data/program.json`.

## Deployment

13. **Domain** — aifordigitaltransformation.org registered at Namecheap, 2026-09-05. `site`/`base` switched, `public/CNAME` added. Remaining: DNS records at Namecheap, custom domain in the repo's Pages settings, then "Enforce HTTPS" (see the domain section of README.md).

14. **GitHub Pages source** — done. Source is set to "GitHub Actions" in the repo settings; every push to `main` redeploys. Live at https://vrcalip-pixel.github.io/ai-program-site/

## Later passes (not started)

- Pass two: hands-free mode (BRIEF §10) — built 2026-09-05 in `src/components/HandsFree.astro`, live behind a preview switch: open the map with `?handsfree` in the address. To ship it for everyone, set `PREVIEW_ONLY` to `false` in that file. (Shipped on `main` behind the switch instead of a branch, because the camera only works over HTTPS on a real device.)
- Labor-market framing on the employers page, only with citations (LA/OC COE, BLS OEWS, CA EDD, Lightcast; APA 7).
- "Request info" form, if a mailto stops being enough.
