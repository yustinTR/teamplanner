# CLAUDE.md — Brain schema

This directory is an **LLM-maintained wiki for the `teamplanner` project — both
clients**: the Next.js PWA in this repository and the Kotlin Android app in
`../teamplanner-android`.
I (the LLM) write and maintain everything under `wiki/`, `index.md` and
`log.md`. The human curates `raw/`, asks questions, and reads the results in
Obsidian.

Read this file before doing anything in this brain.

## Ownership and write authority

Yustin Troost owns `teamplanner` and is the editor of `brain/`. Agents write
here only when acting on his instructions. The immutable `raw/` rule applies to
agents without exception.

## Where this lives

This brain sits at `brain/` inside the **`teamplanner`** repository — the
Next.js PWA (App Router, Supabase, Tailwind v4, Storybook; see the repo's own
`../CLAUDE.md`, `../PROJECT_CONTEXT.md` and `../CONVENTIONS.md` for the build
side). It also covers the **`teamplanner-android`** repository, expected as a
sibling checkout at `../../teamplanner-android` (GitHub
`yustinTR/teamplanner-android`): the Kotlin + Jetpack Compose client that must
stay identical to the web app. Both repositories' `CLAUDE.md` point here. There
is one brain on purpose: the web app is the source of truth, Android follows,
and `wiki/topics/web-android-parity.md` is the ledger that keeps them from
drifting apart (`wiki/decisions/2026-10-23-web-is-the-source-of-truth-for-both-clients.md`).

Same project, two different jobs:

- **`../` and `../../teamplanner-android/` are the build.** Code, migrations, components, tests — *what the app is*, twice.
- **`brain/` is the reasoning behind the build.** Product vision, decisions and
  the alternatives they beat, who the app is for, growth strategy, what was
  planned but never built, open questions — *why the app is the way it is*,
  which git history and the code do not record.

So:

- **Nothing in `brain/` is app code.** No TypeScript, no SQL, no component or
  config is generated here, and no `npm` command is needed to work in it. It is
  plain markdown, read in Obsidian.
- **Brain work never edits the app**, and app work never edits the brain. If a
  task needs both, do them as separate, explicitly-stated steps.
- **Don't duplicate the codebase.** If a fact is already readable in
  `package.json`, a migration, `src/lib/constants.ts`, `../CLAUDE.md`,
  `../PROJECT_CONTEXT.md` or git history, don't restate it here — record the
  *reason* it is that way and link to where it lives
  (`supabase/migrations/20260824100000_add_auto_sync.sql`, `vercel.json`). A
  brain page that merely mirrors the code is a page that will silently go stale.
- **No secrets, no personal data.** No credentials, API keys, database dumps,
  and no names or details of real players, parents or coaches who use the app.
  Refer to where a secret lives, never to its value. The developer's own club
  may be named as the beta-test context; its players may not.
- Repo conventions apply: English throughout, work on `develop`, concise commit
  messages. Keep brain changes in their own commits, separate from app code.

## Layers

| Layer | Path | Owner | Rule |
|---|---|---|---|
| Raw sources | `raw/`, `../docs/plans/`, `../../teamplanner-android/docs/plans/` | human | **Immutable.** Read only. Never edit, rename, move or delete. |
| Wiki | `wiki/` | LLM | Fully owned by me. Create, update, refactor freely. |
| Index | `index.md` | LLM | Catalog of every wiki page. Updated on every ingest. |
| Log | `log.md` | LLM | Append-only. One entry per ingest / query / lint. |
| Schema | `CLAUDE.md` | both | Co-evolved. Propose changes; don't rewrite silently. |

```
brain/
├── CLAUDE.md          this file
├── index.md           content catalog — read this first when answering
├── log.md             chronological record
├── raw/               source documents (immutable) — see the map below
└── wiki/
    ├── overview.md    project state of play — scope, phase, what's settled
    ├── sources/       one page per raw source
    ├── decisions/     one page per decision: what, why, alternatives, status
    ├── entities/      people, systems, integrations, audiences, competitors
    ├── topics/        cross-cutting areas: growth, data model, notifications…
    └── notes/         filed-back answers: comparisons, analyses, open questions
```

### Where the raw sources are

There are **three** immutable source locations, because both repositories
already had one before the brain existed:

| Location | What it holds | Why it is where it is |
|---|---|---|
| `../docs/plans/` | Design documents (`YYYY-MM-DD-<topic>-design.md`) and implementation plans (`YYYY-MM-DD-<topic>-implementation.md`) written in working sessions with the `brainstorming` and `writing-plans` skills (`.agents/skills/`). | Those skills write there. The files stay put so the skills keep working; the brain ingests from them. A plan is a snapshot of intent on its date — the code may have diverged since, and the source page says where. |
| `../../teamplanner-android/docs/plans/` | The Android app's design and implementation plans, same naming, same skills. | Same reason. An Android plan describes a port of web behaviour; its source page records what it ports and what it leaves out, and updates the parity ledger. |
| `../docs/teamplanner-project-documentatie.docx` | The February 2026 project document: the original vision, feature list (MVP and V2), stack, Figma plan, monetisation tiers, phasing. | Predates the first commit. Several of its plans were later reversed; it is the baseline every later decision is measured against. |
| `raw/` | Everything else: user and coach feedback, screenshots of real use, competitor and market notes, analytics exports, KNVB or voetbal.nl findings, app-store material. One dated subfolder per delivery, oldest first. | New material lands here. Nothing in `raw/` yet besides its README. |

Ignore `.DS_Store` and `.obsidian/` — OS and tooling artefacts, not sources.

### Language

Sources are mixed: the project document, `PROJECT_CONTEXT.md` and most design
documents are **Dutch**; some design documents and all code are English. The
wiki is written in **English** (repo convention). Record `language: nl` or `en`
in source frontmatter and quote Dutch verbatim where the exact wording carries
weight — product principles, copy the app is held to, promises on the landing
page. Translate the meaning, never the commitment.

## Page conventions

- **Filenames**: kebab-case, `.md`, descriptive. `wiki/entities/voetbal-nl.md`,
  `wiki/decisions/2026-03-02-growth-before-monetisation.md`. Filename is the
  page identity — renaming breaks links, so rename only deliberately and fix
  every inbound `[[link]]` in the same pass.
- **Frontmatter**: every wiki page starts with YAML (Dataview reads it):

```yaml
---
type: source | decision | entity | topic | note | overview
title: Human readable title
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [topic, topic]
sources: ["[[source-page-name]]"]   # what backs the claims on this page
---
```

- **Links**: `[[page-name]]` wikilinks, no `.md`. Link generously — every
  mention of something that has (or deserves) a page gets linked. A link to a
  page that doesn't exist yet is fine: it's a marker for a page worth writing.
- **Code references**: point at real paths — `src/lib/match-sync.ts`,
  `supabase/migrations/…`. Never paste large code blocks into the brain.
- **Citations**: every non-obvious claim names its source inline —
  `Push was a must-have in the original plan ([[2026-02-xx-project-documentatie-v1]]).`
  If a claim has no source in the brain, mark it `(unsourced)` rather than
  letting it pass as agreed.
- **Who decided**: say whose call it was. On a solo project that is usually
  the developer; say so, and say whether it was a product call, a technical
  call, or a reaction to something a user said.
- **Confidence**: distinguish what a source *says* from what I *conclude*.
  Conclusions live in a `## Synthesis` section, never mixed into the facts.
- **Contradictions**: never silently overwrite. When a new source disagrees
  with an existing page, keep both and record it:

```markdown
> [!warning] Contradiction
> [[2026-02-xx-project-documentatie-v1]] plans Stripe tiers from the start;
> [[2026-03-02-growth-seo-viral-design]] says no paywall until 500+ teams.
> Currently favouring the later document — the tiers were never built.
```

## Page types

**`wiki/sources/<slug>.md`** — one per raw source (design document, plan,
project document, feedback, call notes, analytics export). Prefix with the
date when the source has one: `2026-03-02-multi-team-support-design.md`.
Sections: `## Summary` (3–8 sentences) · `## Key points` · `## Requirements
raised` (anything the app must now do) · `## Decisions made` (link the decision
pages) · `## What was built` (how the code on the ingest date relates to the
plan — built as designed, built differently, not built) · `## Open questions`.
Frontmatter adds `source_file:`, `source_date:`, `language:`.

**`wiki/decisions/<YYYY-MM-DD-slug>.md`** — one per decision that shaped the
build. Frontmatter adds `status: proposed | accepted | superseded | reversed`,
`decided_by:`, `supersedes:`. Sections: `## Decision` (one sentence, plainly)
· `## Context` (what forced the choice) · `## Alternatives considered` (and why
each lost) · `## Consequences` (what this commits us to, what it costs) ·
`## Where it lives in the code` (paths). A decision page is never deleted —
when it is overturned, set `status: superseded`, link forward to the page that
replaced it, and leave the reasoning intact.

**`wiki/entities/<slug>.md`** — a thing that recurs: a person or role, an
audience segment, an external system or integration, a competitor, a hosting
service, a club. Sections: `## What it is` · `## Role in this project` ·
`## Key facts` · `## Relationships` (linked) · `## Open questions`.

**`wiki/topics/<slug>.md`** — a cross-cutting area of the product: growth and
SEO, monetisation, data model, notifications, statistics, training content,
native app. Sections: `## Where we stand` · `## Requirements` · `## Decisions`
(link them) · `## Risks and tensions` · `## Open questions`. These are the
pages that make the brain worth having — they gather scattered sources into one
readable picture per area.

**`wiki/notes/<slug>.md`** — a filed-back answer to a question. Frontmatter
adds `question:`. Leads with the answer, then the reasoning, then citations.

**`wiki/overview.md`** — the project state of play: what is being built and for
whom, what phase it is in, what is settled, what is still open, the biggest
risks. Revised on every ingest that changes the picture, not appended to.

## Workflows

### Ingest — a new file appeared in `raw/` or either `docs/plans/`

1. Read the source in full. If it references images (screenshots, designs),
   read the text first, then view the images that carry real information.
2. Read `index.md` and every wiki page the source plausibly touches.
3. **Discuss takeaways with the human before writing.** Default to one source
   at a time with a check-in; batch only when told to.
4. Write `wiki/sources/<slug>.md`.
5. Propagate: create a decision page for every decision the source records,
   update the topic pages it affects, update or create entity pages, add
   cross-links in both directions, flag contradictions with what was previously
   agreed, revise `wiki/overview.md` if the picture moved. A single source
   typically touches 5–15 pages — touching only the source page means the
   ingest was not finished.
6. For a design document, check the code: was it built, built differently, or
   not at all? Record that in `## What was built` — the gap between plan and
   code is the most valuable thing this brain can surface.
7. **Parity.** For any feature design on either client, update
   `wiki/topics/web-android-parity.md`: add or change the feature's row, and
   write down any platform difference as allowed (with its reason) or as a gap
   owed to the other client.
8. Update `index.md`.
9. Append to `log.md`.

### Query — a question against the brain

1. Read `index.md`, then drill into the relevant pages. Grep the wiki for terms
   the index may not surface.
2. Answer with citations as `[[page-links]]`. Say plainly when the brain does
   not contain the answer — never fill a gap with general Next.js or Supabase
   knowledge presented as project knowledge. Label anything from outside the
   brain.
3. When the question is about *what the app does*, check the code as well as
   the brain, and say when the two disagree.
4. If the answer is durable, offer to file it as `wiki/notes/<slug>.md`, then
   index and log it.

### Parity check — before or after building a feature on either client

1. Read `wiki/topics/web-android-parity.md` and the feature's row.
2. Compare the two implementations where the ledger says "unverified":
   `src/lib/constants.ts` ↔ `data/Constants.kt`, `src/lib/lineup-generator.ts` ↔
   `data/LineupGenerator.kt`, `src/lib/player-rating.ts` ↔ `data/PlayerRating.kt`,
   `src/types/*.ts` ↔ `data/model/*.kt`, and the Dutch copy.
3. Record the result in the ledger: parity, gap (who owes it), or allowed
   difference (why). Never resolve a gap by editing code from brain work.

### Lint — a health check

Report, grouped, with proposed fixes:
- contradictions between pages, and brain claims the codebase now contradicts
- decisions marked `accepted` that the code no longer reflects
- decisions marked `proposed` whose work has since been built or abandoned
- stale claims a newer source has superseded
- orphan pages (no inbound links) and dead `[[links]]` that now deserve a page
- topics referenced repeatedly across sources but with no topic page of their own
- open questions that have been open a long time and need chasing
- missing cross-references between pages that clearly relate
- `index.md` entries out of sync with the files on disk
- new files in either `docs/plans/` with no source page yet
- ledger rows marked "unverified" or "undecided" that have been open a long time
- a web or Android feature in git history with no ledger row

Propose; don't bulk-rewrite the brain unprompted.

## index.md format

Grouped by page type, one line each:
`- [[page-name]] — one-line summary`. Decisions show their status. Kept
alphabetical within each group, except decisions which are newest first.

## log.md format

Append-only, newest at the bottom, consistent prefix so `grep "^## \[" log.md`
works:

```markdown
## [YYYY-MM-DD] ingest | Source Title
Pages touched: [[a]], [[b]], [[c]]
One or two lines on what changed in the picture.
```

`ingest` · `query` · `lint` · `refactor` are the entry kinds.

## Style

- Dense and factual. No filler, no restating the question.
- Prose in short paragraphs; bullets for genuine lists, not to avoid writing.
- Dates absolute (`2026-03-14`), never "last week" or "recently".
- English throughout, including when the source is Dutch — note the source
  language in the source page's frontmatter and quote key phrasing verbatim
  where the exact wording matters.
- Prefer editing an existing page over creating a near-duplicate. Two pages on
  the same thing is the main failure mode of a growing wiki.
