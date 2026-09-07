# TODO — things only Vincent can answer

Every item below is also marked `TODO(vincent)` in the file it lives in. Facts in BRIEF §2 were followed as written; these are the places the brief itself says "verify", "assumed", or "Vincent supplies".

## Facts to confirm

1. **Certificate composition** — confirmed by Vincent, 2026-09-05. AI Literacy = AI 40 + AI 45; AI Fluency = AI 40, 45, 60, 65; the 18-unit certificate = all six AI courses.

2. **6-unit Certificate of Accomplishment** — status updated per Vincent, 2026-09-05: "In development", expected to be offered no later than Spring 2027 (BRIEF §2 said "Approved"; the site now follows Vincent). Still open: whether it is transcripted — `src/pages/pathway.astro` (`transcripted()`) shows "To be confirmed".

3. **Ask Curriculum to correct CS 31 on the program sheet** — the catalog program sheet for Plan Code 2150 prints CS 31 at 3 units and a 28-unit subtotal; the course is 4 units (confirmed by Vincent, 2026-09-07). The site shows 4 and a 29-unit core, with a one-line note under CS 31 in the counselor page's "General education and electives" panel; remove that note (`plans.json`, `supporting[0].note`) once the sheet is fixed. LBCC-GE = 27 units confirmed the same day against the other associate-degree sheets in the 2026–27 catalog (all read "LBCC-GE or Cal-GETC, 27–34").

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

11. **Hero videos (six)** — all six done 2026-09-07 from Vincent's clips, each a 4.4 s crossfaded loop (MP4 + WebM + poster, 0.7–1.9 MB per format). To replace one later: `node scripts/hero-video.mjs <clip.mp4> ai-nn` and commit. Note: the AI 70 clip shows a hand; BRIEF §9 says no faces or hands. Vincent has seen it and it stays unless he says otherwise.

12. **Student work showcase** — `src/pages/courses/[slug].astro` ships the section hidden (`data-showcase="empty"`). Remove the attribute when there is work to show.

## Request-info form

15. **Form backend** — connected 2026-09-05 to an Apps Script on Vincent's personal Google account (interim). Later: recreate the Sheet and script under a school-facing account by repeating `FORM-SETUP.md` there, then replace `form.endpoint` in `src/data/program.json`.

## Deployment

13. **Domain** — aifordigitaltransformation.org registered at Namecheap, 2026-09-05. `site`/`base` switched, `public/CNAME` added. Remaining: DNS records at Namecheap, custom domain in the repo's Pages settings, then "Enforce HTTPS" (see the domain section of README.md).

14. **GitHub Pages source** — done. Source is set to "GitHub Actions" in the repo settings; every push to `main` redeploys. Live at https://vrcalip-pixel.github.io/ai-program-site/

## Ask the program

16. **FAQ answers to verify** — `src/data/faq.json`. Three entries carry `_todo` notes: class format (online / in person), fees, and enrollment steps. Every other answer is drawn from the site; edit any wording freely. Questions with no match are sent to the request-info form, so the form Sheet doubles as the list of questions to add.

## Pass two (2026-09-06, branch `claude/pass-two-development-xsinfa`)

Done in this pass: the map keeps AI 40 in frame on phones; "Where are you on the ladder?" on the pathway page; print styles for content pages; JSON-LD structured data; hands-free now serves its own runtime, has every threshold in one `TUNE` object, and a `?hf=debug` overlay for tuning (README, "Hands-free control"); the About page states the hands-free rationale (BRIEF §10).

17. **Tune the gestures from real use** — simplified 2026-09-07 to point, hold, open-hand swipe left (next), still fist (back) and grab-toss-release (reset) after the first set proved hard to perform. Open the map with `?hf=debug`, try each, and adjust `TUNE` in `src/components/HandsFree.astro` (or `localStorage.hf.tune` first, no rebuild). Likely knobs: `dwellMs` (hold time), `reach` (how much arm travel), `filterMinCutoff` (steadiness vs lag), `swipeMinDx` and `swipeMinSpeed` (how big and how quick an open-hand sweep), `fistHoldMs` (how long a fist is held before it counts), `fistStillSpeed` (how still it must be), `throwMinDx` and `throwWindow` (how far and how quickly a closed hand must travel between grab and release), `openGrace` (how long the swipe forgives a hand that reads as not-quite-open).

18. **Spot-check the labor-market figures** — `src/data/labor.json` feeds "AI at work, by the numbers" on the employers page. Every figure names its source and the reference list links the page it came from. The build sandbox could not open bls.gov, edd.ca.gov, coeccc.net, lightcast.io, mckinsey.com, weforum.org, hai.stanford.edu, ilo.org, oecd.org or pwc.com directly (network policy), so each number was confirmed from at least two independent search results quoting the primary page. Open each reference once, confirm the number, then update `checked` in the file. Two figures to watch: BLS data scientists 34.6% (the handbook rounds it to 35%) and the AI Index country shares (Lightcast's own outlook quotes the U.S. at 2.6%; a Lightcast blog on the same index says 2.5%, up 55% on 2024).

## Later passes (not started)

- Refresh the labor dashboard each year when BLS publishes new projections (late August), OEWS (spring) and the AI Index (April); the LA/OC Centers of Excellence reports and CA EDD projections when they update.
- Student work showcase on the course pages, once there is work to show (item 12).

19. **Confirm the credential-to-course pairings** — `src/data/credentials.json` (`pairs`, `status`). IBM SkillsBuild in AI 40 and Azure AI Fundamentals prepared for in AI 40 are Vincent's; Google (AI 45), OpenAI (AI 45, AI 60), Anthropic (AI 60, AI 70) and AWS (AI 65, beside COSN 250) are the site's suggestions and read "Suggested" until changed. Costs were the issuers' US list prices in September 2026; re-check each term. If official logos are wanted in the brand tiles, each owner's brand permission is needed and BRIEF §4 (no new colours) would need Vincent's exception.
