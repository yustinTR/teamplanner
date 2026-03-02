# Share & Match Improvements Design

## Goal

Three features that improve the post-match experience and shareability of TeamPlanner: match overview tabs with score editing, lineup image sharing, and match report generation.

## Feature 1: Match Overview Tabs + Score Editing

### Match Tabs

The MatchList currently shows all matches in a single list (upcoming first, past below). Replace with a two-tab layout:

- **"Aankomend"** (default) — matches with `status === "upcoming"` and `match_date >= now`, sorted by date ascending (soonest first)
- **"Gespeeld"** — matches with `status === "completed"` or `status === "cancelled"` or `match_date < now`, sorted by date descending (most recent first)
- Use shadcn `Tabs` component
- "Toevoegen" and "Vernieuwen" buttons remain visible on both tabs

### Score Editing

On the match detail page:

- **Upcoming matches in the past** (`status === "upcoming"`, `match_date < now`): show "Score invullen" button that sets status to `completed`
- **Completed matches** (`status === "completed"`): show pencil icon button next to the score display to edit/correct the score
- Both use the same dialog with two numeric inputs (home/away score)
- Reuses existing `useUpdateMatch` mutation

## Feature 2: Lineup Image Sharing

### User Flow

1. Coach or player views a lineup on the match detail page
2. Taps "Deel opstelling" button (Share icon)
3. A styled PNG is generated from a hidden share-ready component
4. Native share menu opens (Web Share API) to share via WhatsApp, Instagram, etc.
5. Fallback on desktop/older browsers: download as PNG

### Image Layout (~1080x1350px)

```
+----------------------------------+
|                                  |
|  FC Testteam                     |
|  vs. Tegenstander                |
|  Za 15 mrt - 14:30 - 4-3-3      |
|                                  |
|  +----------------------------+  |
|  |                            |  |
|  |    Green pitch with        |  |
|  |    FUT-style mini-cards    |  |
|  |    on positions            |  |
|  |                            |  |
|  +----------------------------+  |
|                                  |
|  Bank: Jansen, Bakker, Smit     |
|                                  |
|  --------------------------------|
|  myteamplanner.nl                |
+----------------------------------+
```

**Styling:**
- Dark background (dark green/black gradient) so the pitch pops
- Team name large, opponent + date smaller below
- Green pitch with existing FUT mini-cards (gold/silver/bronze) on positions
- Bench players as a row of names below the pitch
- Subtle branding footer: "myteamplanner.nl"
- Rounded corners, subtle shadow

### Technical

- `html2canvas` for DOM-to-PNG rendering
- A hidden "share-ready" component with fixed dimensions, proper padding, header/footer — not a screenshot of the visible UI
- Web Share API: `navigator.share({ files: [pngFile] })`
- Feature detection: `navigator.canShare` check, fallback to download link
- Share button appears on:
  - `LineupView` (read-only on match detail) — all users
  - `LineupField` (editor) — coaches, after saving

## Feature 3: Match Report

### User Flow

1. On a completed match detail page, a "Deel verslag" button appears
2. Two share options:
   - **As text** — formatted match summary copied to clipboard
   - **As image** — styled PNG via same html2canvas infrastructure

### Text Format

```
FC Testteam 3 - 1 Tegenstander
Za 15 mrt - 14:30

Doelpunten:
  Jan de Vries (23', 67')
  Pieter Bakker (45')

Assists:
  Willem Visser (23', 45')

Kaarten:
  Klaas Jansen (55')

myteamplanner.nl
```

### Image Format

Same styling approach as lineup image:
- Dark background card
- Score large at the top
- Stats (goals, assists, cards) listed below
- Same branding footer
- ~1080x1350px

### Data Sources

- Match details: `useMatch` hook (teams, date, score)
- Player stats: `useMatchStats` hook (goals, assists, cards)
- Substitution plan: from lineup data
- Lineup positions: from lineup data

### Technical

- Reuses share infrastructure from Feature 2 (html2canvas + Web Share API)
- Text version: `navigator.clipboard.writeText()` with toast confirmation "Gekopieerd!"
- Shared `ShareCard` component for consistent dark-themed card styling

## Implementation Order

1. **Match tabs + score editing** — foundational, fixes a usability gap
2. **Lineup image sharing** — builds share infrastructure (html2canvas + Web Share API)
3. **Match report** — reuses share infrastructure from step 2

## Files Overview

### New

| File | Type | Description |
|------|------|-------------|
| `src/components/molecules/MatchTabs/` | Molecule | Tab switcher for upcoming/played |
| `src/components/molecules/ScoreEditor/` | Molecule | Score input dialog (reusable) |
| `src/components/molecules/ShareLineupCard/` | Molecule | Hidden share-ready lineup layout |
| `src/components/molecules/ShareMatchReport/` | Molecule | Hidden share-ready match report |
| `src/hooks/use-share-image.ts` | Hook | html2canvas + Web Share API logic |

### Modified

| File | Change |
|------|--------|
| `src/components/organisms/MatchList/MatchList.tsx` | Add tab layout |
| `src/app/(main)/matches/[id]/page.tsx` | Add score editing, share buttons |
| `src/components/organisms/LineupView/LineupView.tsx` | Add share button |
| `src/components/organisms/LineupField/LineupField.tsx` | Add share button after save |
