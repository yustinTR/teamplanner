# Multi-Team Support Design

## Problem

Users can only belong to one team. In practice, a person may coach one team (e.g. G2) and play on another (e.g. 5de). The app needs to support multiple team memberships with a way to switch between them.

## Design Decisions

- **Team switcher in the header** — compact badge/dropdown above page content
- **Full refresh on switch** — navigates to dashboard, reloads all data. Simple, no stale data risk
- **Both coach and player roles** — user can create multiple teams as coach AND join other teams as player via invite code
- **Persist selection in localStorage** — last active team remembered across sessions

## Database

No schema changes needed. The existing `players` table already serves as the membership table:

- Coach: `teams.created_by = auth.uid()`
- Player: `players.user_id = auth.uid()` with `team_id`
- RLS: `get_my_team_ids()` already returns all teams for a user

The only change is in queries: replace `.limit(1).single()` with queries that return all matching teams.

## Auth Store Changes

Current state:
```
user | currentTeam | currentPlayer | isCoach
```

New state:
```
user | myTeams[] | currentTeam | currentPlayer | isCoach
```

New actions:
- `setMyTeams(teams[])` — called during hydration
- `switchTeam(teamId)` — updates currentTeam, saves to localStorage, triggers router.refresh()

## Layout Changes (`app/(main)/layout.tsx`)

Current: loads 1 team via `.limit(1).single()`.

New flow:
1. Load all teams where user is coach (`teams.created_by`) OR player (`players.user_id`)
2. Check localStorage for `lastTeamId`
3. If `lastTeamId` exists and is in the user's team list, use it
4. Otherwise fallback to first team
5. Load player record for selected team
6. Hydrate store with `myTeams[]`, `currentTeam`, `currentPlayer`

## AuthHydrator Changes

Accepts new `myTeams` prop alongside existing `team` and `player`. Calls `setMyTeams()` on mount.

## TeamSwitcher Component

New molecule: `src/components/molecules/TeamSwitcher/`

Behavior:
- Shows current team name + team_type as a compact badge
- If user has 1 team: static display, no interaction
- If user has 2+ teams: clickable, opens a dropdown or bottom sheet
- Each option shows: team name, team_type, role (Coach/Speler)
- Selection calls `switchTeam(teamId)` which saves to localStorage and does `router.refresh()`

Placement: in the main layout header, above page content.

## Component Hierarchy

```
app/(main)/layout.tsx
  └── TeamSwitcher (new, in header)
  └── {children}
  └── NavigationBar (unchanged)
```

## What Does NOT Change

- All existing pages continue to use `useAuthStore().currentTeam` — no page changes needed
- RLS policies work as-is
- Join flow works as-is (creates player record, user now has 2+ teams)
- Create team flow works as-is (new team appears in myTeams after refresh)
- Bottom navigation stays the same
- All hooks stay the same (they all take teamId/matchId params)

## Edge Cases

- **User with 0 teams:** same as today — redirect to create-team
- **User creates a second team:** after creation, refresh loads both teams, user can switch
- **User joins a team via invite while already having a team:** same — refresh shows both
- **localStorage has a teamId the user no longer belongs to:** fallback to first team
- **Coach leaves/deletes a team:** team disappears from myTeams on next refresh
