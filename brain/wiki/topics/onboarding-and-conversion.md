---
type: topic
title: Onboarding and conversion
created: 2026-10-23
updated: 2026-10-23
tags: [onboarding, conversion, landing-page, ux]
sources: ["[[2026-02-26-onboarding-checklist-hints-design]]", "[[2026-03-02-growth-seo-viral-design]]", "[[2026-03-04-landing-page-conversion-design]]"]
---

# Onboarding and conversion

## Where we stand

The funnel is: search or shared link → landing page → register → create team → add players → share invite → players tap availability. Each step has a source:

- **Landing page** ([[2026-03-04-landing-page-conversion-design]]): animated hero demo, live team counter, sticky mobile CTA, trust strip *"Gratis · Geen creditcard · Klaar in 30 seconden"*. Fictional quotes removed the same day ([[2026-03-04-landing-page-shows-the-app]]).
- **Coach onboarding** ([[2026-02-26-onboarding-checklist-hints-design]]): four-step checklist on the dashboard ending in "share the invite link", plus one-time hints at the availability grid, lineup editor, substitution plan and match stats. State in `localStorage` ([[2026-02-26-onboarding-state-in-localstorage]]).
- **Player onboarding** ([[2026-03-02-growth-seo-viral-design]]): the invite link previews in WhatsApp with the team name and lands on *"Coach X nodigt je uit voor Team Y"*; a `join_team` RPC and e-mail templates exist since 2026-02-25 (`supabase/migrations/20260225080855_*`).
- **Voetbal.nl import** shortens "add players" and "plan matches" for teams that exist on voetbal.nl ([[voetbal-nl-integration]]).

## Requirements

- A coach must reach a shared invite link without documentation; a player must reach their first availability tap from a WhatsApp message in one flow.
- Social proof must be real.

## Decisions

- [[2026-02-26-onboarding-state-in-localstorage]]
- [[2026-03-04-landing-page-shows-the-app]]

## Risks and tensions

- **The one funnel number we have is bad.** 20 of 22 teams never got a second member with an account ([[2026-10-23-active-team-count]]). Whether coaches never share the link, players do not open it, or registration stops them is unknown; GTM events exist since 2026-03-09 and could say.
- **Registration is the wall.** A player must create an account to answer availability; the February plan mentioned magic links, the build has e-mail and password. Whether a no-account availability answer was ever considered is unsourced.
- **The last checklist step is a proxy** (visited team settings), not the real event (link shared).

## Open questions

- Registration-to-first-availability conversion: what is it?
- Real coach quotes for the social-proof band: are there any yet?
