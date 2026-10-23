---
type: source
title: Share and match improvements (design)
created: 2026-10-23
updated: 2026-10-23
tags: [sharing, matches, viral, ux]
source_file: docs/plans/2026-03-02-share-and-match-improvements-design.md (implementation plan: docs/plans/2026-03-02-share-and-match-implementation.md)
source_date: 2026-03-02
language: en
sources: []
---

# Share and match improvements (design)

## Summary

Three features for *"the post-match experience and shareability"*: match list tabs (Aankomend / Gespeeld) with score editing, a shareable lineup image, and a match report shareable as text or image. The image is rendered from a hidden, share-ready component at roughly 1080×1350 px with a dark background, the FUT-style mini cards on a green pitch, the bench as a row of names, and a *"myteamplanner.nl"* footer — *"not a screenshot of the visible UI"*. Sharing uses the Web Share API with a download fallback.

## Key points

- Tabs: upcoming by date ascending; played (completed, cancelled, or in the past) by date descending.
- Score editing: *"Score invullen"* on a past upcoming match flips it to completed; a pencil edits a completed score; both reuse `useUpdateMatch`.
- Share infrastructure is built once (`use-share-image` hook, html2canvas + `navigator.share`) and reused by the match report.
- Text report format is fixed in the source (score, scorers with minutes, assists, cards, footer).

## Requirements raised

- A lineup or result must be shareable into WhatsApp as an image in one tap.

## Decisions made

- [[2026-03-02-share-images-from-hidden-components]]

## What was built

Built as designed with one substitution: `html2canvas-pro` instead of `html2canvas` (`package.json`, `CLAUDE.md`), presumably for Tailwind v4's modern colour functions — the reason is not recorded (unsourced). Components `ShareLineupCard`, `ShareMatchReport`, hook `use-share-image`.

## Open questions

- Does the text report still match the design's format, and is it used? Not checked. → [[growth-and-seo]]
