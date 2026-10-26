---
title: A read-only follow link answers "do coach-only teams want members?"
date: 2026-10-26
status: accepted
tags: [decision, product, growth, privacy]
---

# A read-only follow link answers "do coach-only teams want members?"

## Decision

Parents, carers and players who will never make an account get a **team-level link** (`/volg/<token>`) that shows the programme (kick-off, gathering time, location, home/away) and the published lineup of each upcoming match, plus the last three results. The coach switches it on in team settings; switching it off clears the token, so old links die. No login, no availability, no statistics, no photos — names on the pitch only, which is exactly what the coach already pastes into WhatsApp as an image.

## Why

- Nine of the eleven active teams are run by the coach alone ([[2026-10-25-active-team-recount]]). The February and March visions assumed everybody joins; the data says they do not. A link that needs nothing from the reader is the lowest-friction way to find out whether the people around a coach-only team *want* to follow along at all.
- It turns every shared link into a page with the product's name on it — the same loop as the share-image strip ([[2026-10-25-made-with-strip-on-share-images]]), but it stays current without the coach re-sharing.
- It is cheap to build: one nullable column, one `SECURITY DEFINER` function that returns JSON for anon, one server-rendered page. Same pattern as `get_team_by_invite_code`.

## Alternatives considered

- **Per-match links** — more granular, but the coach would share a new link every week; the team link stays the same and that is the point.
- **Magic-link accounts for parents** — still an account; the whole question is whether that friction is the blocker.
- **Public team pages (indexed)** — no: minors' names must not be searchable. The page is `noindex` and only reachable with the token; the token is a 32-hex random string, not guessable.

## Privacy

The link exposes player names on a lineup to anyone who holds it. That is the coach's choice, the same as sharing the lineup image in a group chat, and the switch is off by default. The privacy policy already covers sharing by the coach; no new data is stored about readers.

## Measure

GTM event `enable_follow_link` and the share of teams with a token after a month tell whether coach-only teams reach for it. If few do, the "members" question is answered too: the coach alone is the product.

## Related

- [[2026-10-25-roadmap-coach-first-autumn-2026]] — step 4, second half
- [[2026-10-25-active-team-means-coach-use]]
- [[web-android-parity]] — Android: the setting is owed; the page is web-only by nature
