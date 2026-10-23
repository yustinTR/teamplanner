---
type: decision
title: Share images rendered from hidden components, watermarked
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product and technical call, 2026-03-02
supersedes: ""
tags: [sharing, viral, growth]
sources: ["[[2026-03-02-share-and-match-improvements-design]]", "[[2026-03-02-growth-seo-viral-design]]"]
---

# Share images rendered from hidden components, watermarked

## Decision

Lineups and match reports are shared as PNGs rendered from dedicated, hidden, fixed-size components — not screenshots of the UI — through the Web Share API with a download fallback, and every image carries a visible *"myteamplanner.nl"* footer.

## Context

[[whatsapp]] is where the team already is, so the output has to land there as an image ([[2026-03-02-share-and-match-improvements-design]]). A dedicated component gives a portrait 1080×1350 layout with header, pitch, bench and footer regardless of the viewer's screen. The watermark is the viral loop: *"Ensure all shared images … include a subtle but visible 'myteamplanner.nl' watermark"* ([[2026-03-02-growth-seo-viral-design]]).

## Alternatives considered

- **Screenshot the visible lineup.** Depends on viewport and theme; no room for branding. Rejected explicitly.
- **Server-side image rendering** (as `app/api/og/` does for link previews). Would work, but needs the full lineup state posted to the server and a second rendering of the pitch; the client already has everything.
- **Text-only sharing.** Kept as a second option for the match report, not for the lineup.

## Consequences

- `html2canvas-pro` rather than `html2canvas` in `package.json`; not a deliberate choice — *"die keuze heb ik niet nadrukkelijk gemaakt"* ([[2026-10-23-open-questions-answered]]). Most likely picked during implementation for Tailwind v4 colour support (synthesis).
- Every shared image is an advertisement; changing the footer is a growth decision, not a styling one.
- [[teamplanner-android]] renders the same card with Compose `Canvas` at 540×810 and shares it through the system share sheet; the size difference is a gap: Android moves to 1080×1350 ([[2026-10-23-android-share-image-matches-the-web-card]]).

## Where it lives in the code

- `src/hooks/use-share-image.ts`
- `src/components/molecules/ShareLineupCard/`, `ShareMatchReport/`
