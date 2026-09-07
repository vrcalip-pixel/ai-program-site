# Working agreements for this repository

Read BRIEF.md first: it is the source of truth for facts, scope and design. README.md explains where content lives; TODO.md lists what only Vincent can answer.

## Publishing (Vincent's standing instruction, 2026-09-07)

After each change is verified, commit with a plain-English message and push straight to `main`. The Pages workflow deploys `main` within about a minute; that is how Vincent reviews, from the live site. Do not open pull requests unless he asks for one. Before pushing: `npm run build` must pass, and check the affected page in a browser (desktop and phone widths, plus an axe pass) as the earlier sessions did.

Still show Vincent before pushing when a change touches facts: credential status, financial-aid eligibility, transfer, codes, the labor-market figures in `src/data/labor.json`, or anything BRIEF §2 calls a hard constraint.

## Design

No new colours, fonts or motion (BRIEF §4, §12). Primary pills are brass with dark ink; secondary pills are ghost outlines. Charts use brass for emphasis and secondary ink for context.
