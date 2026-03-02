# Share & Match Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add match tabs (upcoming/played), score editing for completed matches, lineup image sharing via Web Share API, and match report sharing.

**Architecture:** Feature 1 (tabs + score editing) modifies existing MatchList and match detail page. Feature 2 (lineup sharing) adds html2canvas for DOM-to-PNG rendering with a hidden share-ready layout component and a reusable `useShareImage` hook. Feature 3 (match report) reuses the share infrastructure from Feature 2.

**Tech Stack:** Next.js 16, shadcn/ui Tabs, html2canvas, Web Share API, React Query, Tailwind CSS v4

---

## Task 1: Add Tabs to MatchList

**Files:**
- Modify: `src/components/organisms/MatchList/MatchList.tsx`

**Step 1: Add tab imports and state**

At the top of `MatchList.tsx`, add:

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

**Step 2: Replace the single list with a tabbed layout**

Replace the return section (from `return (` to end) with a Tabs layout. The existing `upcoming` and `past` arrays are already computed — wrap them in separate TabsContent.

Replace from line 129 `return (` onwards:

```tsx
return (
  <div>
    {refreshResult && (
      <div className="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">
        {refreshResult.matchesCreated > 0 &&
          `${refreshResult.matchesCreated} nieuwe wedstrijden. `}
        {refreshResult.matchesUpdated > 0 &&
          `${refreshResult.matchesUpdated} wedstrijden bijgewerkt. `}
        {refreshResult.matchesCreated === 0 &&
          refreshResult.matchesUpdated === 0 &&
          "Alles is al up-to-date."}
      </div>
    )}
    {refreshMatches.isError && (
      <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
        {refreshMatches.error instanceof Error
          ? refreshMatches.error.message
          : "Er is een fout opgetreden bij het vernieuwen."}
      </div>
    )}
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {matches.length} {matches.length === 1 ? "wedstrijd" : "wedstrijden"}
      </p>
      {isCoach && (
        <div className="flex gap-2">
          {hasImportSource && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshMatches.isPending}
            >
              <RefreshCw
                className={`mr-1 size-4 ${refreshMatches.isPending ? "animate-spin" : ""}`}
              />
              {refreshMatches.isPending ? "Vernieuwen..." : "Vernieuwen"}
            </Button>
          )}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 size-4" />
                Toevoegen
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Wedstrijd toevoegen</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <MatchForm
                  {...matchFormProps}
                  submitLabel="Toevoegen"
                  onSubmit={async (data) => {
                    if (!currentTeam) return;
                    await createMatch.mutateAsync({
                      ...data,
                      team_id: currentTeam.id,
                    });
                    setSheetOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>

    <Tabs defaultValue="upcoming">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="upcoming" className="flex-1">
          Aankomend ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="played" className="flex-1">
          Gespeeld ({past.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Geen aankomende wedstrijden.
          </p>
        ) : (
          <AnimatedList className="space-y-2">
            {groupByMonth(upcoming).map(([month, monthMatches]) => (
              <AnimatedListItem key={month}>
                <h2 className="mb-2 text-sm font-medium capitalize text-muted-foreground">
                  {month}
                </h2>
                <div className="space-y-2">
                  {monthMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      defaultGatheringMinutes={currentTeam?.default_gathering_minutes ?? 60}
                      onClick={() => router.push(`/matches/${match.id}`)}
                    />
                  ))}
                </div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        )}
      </TabsContent>

      <TabsContent value="played">
        {past.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nog geen gespeelde wedstrijden.
          </p>
        ) : (
          <AnimatedList className="space-y-2">
            {groupByMonth(past).map(([month, monthMatches]) => (
              <AnimatedListItem key={month}>
                <h2 className="mb-2 text-sm font-medium capitalize text-muted-foreground">
                  {month}
                </h2>
                <div className="space-y-2">
                  {monthMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      defaultGatheringMinutes={currentTeam?.default_gathering_minutes ?? 60}
                      onClick={() => router.push(`/matches/${match.id}`)}
                    />
                  ))}
                </div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        )}
      </TabsContent>
    </Tabs>
  </div>
);
```

**Step 3: Update groupByMonth to return entries array**

Change the `groupByMonth` function to return an array of entries instead of a Record (for easier mapping):

```typescript
function groupByMonth(matches: Match[]): [string, Match[]][] {
  const groups: Record<string, Match[]> = {};
  for (const match of matches) {
    const date = new Date(match.match_date);
    const key = date.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(match);
  }
  return Object.entries(groups);
}
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 5: Commit**

```bash
git add src/components/organisms/MatchList/
git commit -m "feat: add upcoming/played tabs to match list"
```

---

## Task 2: Add Score Editing to Match Detail

**Files:**
- Modify: `src/app/(main)/matches/[id]/page.tsx`

**Step 1: Add score edit dialog for completed matches**

In the match detail header section, after the existing `MatchScore` display (lines 110-117), add an edit button for coaches:

```tsx
{match.status === "completed" && (
  <div className="mt-2 flex items-center gap-2">
    <MatchScore
      scoreHome={match.score_home}
      scoreAway={match.score_away}
    />
    {isCoach && (
      <button
        onClick={() => {
          setScoreHome(match.score_home ?? 0);
          setScoreAway(match.score_away ?? 0);
          setCompleteOpen(true);
        }}
        className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Pencil className="size-3.5" />
      </button>
    )}
  </div>
)}
```

**Step 2: Show "Score invullen" button for past upcoming matches**

After the existing `{isCoach && match.status === "upcoming" && (` block (line 243), add a new block for past upcoming matches:

```tsx
{isCoach && match.status === "upcoming" && new Date(match.match_date) < new Date() && (
  <div className="rounded-xl bg-white p-4 shadow-md">
    <p className="mb-3 text-sm text-muted-foreground">
      Deze wedstrijd is al geweest. Vul de score in om hem af te ronden.
    </p>
    <Button
      className="w-full gap-2"
      onClick={() => {
        setScoreHome(0);
        setScoreAway(0);
        setCompleteOpen(true);
      }}
    >
      <CheckCircle className="size-4" />
      Score invullen
    </Button>
  </div>
)}
```

**Step 3: Update the complete dialog to also handle score editing**

Change the dialog title to be dynamic based on whether the match is already completed:

```tsx
<DialogTitle>
  {match.status === "completed" ? "Score bewerken" : "Wedstrijd afronden"}
</DialogTitle>
<DialogDescription>
  {match.status === "completed"
    ? "Pas de score aan."
    : "Vul de eindstand in om de wedstrijd als gespeeld te markeren."}
</DialogDescription>
```

And update the submit handler to not set status when editing an already completed match:

```tsx
<Button
  onClick={async () => {
    await updateMatch.mutateAsync({
      id: match.id,
      ...(match.status !== "completed" && { status: "completed" as const }),
      score_home: scoreHome,
      score_away: scoreAway,
    });
    setCompleteOpen(false);
  }}
>
  {match.status === "completed" ? "Opslaan" : "Afronden"}
</Button>
```

**Step 4: Remove the `{isCoach && match.status === "upcoming" && (` guard from the Dialog**

The complete/score dialog should now be a standalone Dialog (not inside the upcoming-only button group) since it's triggered from multiple places. Move the `Dialog` for completing/editing outside the `{isCoach && match.status === "upcoming" && (` block so it's always rendered but only opened via state.

**Step 5: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 6: Commit**

```bash
git add src/app/\(main\)/matches/\[id\]/page.tsx
git commit -m "feat: add score editing for completed and past matches"
```

---

## Task 3: Install html2canvas and Create useShareImage Hook

**Files:**
- Create: `src/hooks/use-share-image.ts`

**Step 1: Install html2canvas**

Run: `npm install html2canvas-pro`

Note: Use `html2canvas-pro` which is the actively maintained fork with better support for modern CSS.

**Step 2: Create the share image hook**

Create `src/hooks/use-share-image.ts`:

```typescript
"use client";

import { useCallback, useState } from "react";
import html2canvas from "html2canvas-pro";

interface UseShareImageReturn {
  share: (element: HTMLElement, filename: string) => Promise<void>;
  isGenerating: boolean;
}

export function useShareImage(): UseShareImageReturn {
  const [isGenerating, setIsGenerating] = useState(false);

  const share = useCallback(async (element: HTMLElement, filename: string) => {
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))), "image/png");
      });

      const file = new File([blob], `${filename}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { share, isGenerating };
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build passes

**Step 4: Commit**

```bash
git add package.json package-lock.json src/hooks/use-share-image.ts
git commit -m "feat: add html2canvas and useShareImage hook"
```

---

## Task 4: Create ShareLineupCard Component

**Files:**
- Create: `src/components/molecules/ShareLineupCard/ShareLineupCard.tsx`
- Create: `src/components/molecules/ShareLineupCard/ShareLineupCard.stories.tsx`
- Create: `src/components/molecules/ShareLineupCard/index.ts`

**Step 1: Create the share-ready lineup layout component**

Create `src/components/molecules/ShareLineupCard/ShareLineupCard.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/atoms/PlayerCard";
import type { CardTier } from "@/lib/player-rating";

interface SharePlayer {
  name: string;
  positionLabel: string;
  x: number;
  y: number;
  overall?: number | null;
  cardTier?: CardTier | null;
}

interface ShareLineupCardProps {
  teamName: string;
  opponent: string;
  matchDate: string;
  formation: string;
  players: SharePlayer[];
  benchNames: string[];
  className?: string;
}

export function ShareLineupCard({
  teamName,
  opponent,
  matchDate,
  formation,
  players,
  benchNames,
  className,
}: ShareLineupCardProps) {
  const date = new Date(matchDate);
  const dateStr = date.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex w-[540px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">{teamName}</h2>
        <p className="mt-0.5 text-base text-white/70">vs. {opponent}</p>
        <p className="mt-0.5 text-sm text-white/50">
          {dateStr} · {timeStr} · {formation}
        </p>
      </div>

      {/* Pitch */}
      <div className="relative aspect-[68/105] w-full overflow-hidden rounded-xl bg-green-600">
        {/* Field markings */}
        <div className="absolute inset-3 rounded-md border-2 border-white/40" />
        <div className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="absolute inset-x-[20%] top-3 h-[18%] border-2 border-t-0 border-white/40" />
        <div className="absolute inset-x-[20%] bottom-3 h-[18%] border-2 border-b-0 border-white/40" />

        {/* Players */}
        {players.map((player, i) => (
          <div
            key={i}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            {player.overall != null && player.cardTier != null ? (
              <PlayerCard
                name={player.name}
                position={player.positionLabel}
                overall={player.overall}
                tier={player.cardTier}
                size="sm"
              />
            ) : (
              <>
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white shadow-md">
                  {player.positionLabel}
                </div>
                <span className="mt-0.5 max-w-[60px] truncate text-center text-[10px] font-medium text-white drop-shadow-md">
                  {player.name.split(" ").pop()}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bench */}
      {benchNames.length > 0 && (
        <p className="mt-3 text-center text-sm text-white/60">
          Bank: {benchNames.join(", ")}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/30">
        myteamplanner.nl
      </div>
    </div>
  );
}
```

**Step 2: Create barrel export**

Create `src/components/molecules/ShareLineupCard/index.ts`:

```typescript
export { ShareLineupCard } from "./ShareLineupCard";
```

**Step 3: Create stories**

Create `src/components/molecules/ShareLineupCard/ShareLineupCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareLineupCard } from "./ShareLineupCard";

const meta: Meta<typeof ShareLineupCard> = {
  title: "Molecules/ShareLineupCard",
  component: ShareLineupCard,
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareLineupCard>;

export const Default: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "SC Heerenveen",
    matchDate: "2026-03-15T14:30:00",
    formation: "4-3-3",
    players: [
      { name: "Jan de Vries", positionLabel: "K", x: 50, y: 90, overall: 75, cardTier: "silver" },
      { name: "Pieter Bakker", positionLabel: "LB", x: 15, y: 70, overall: 68, cardTier: "bronze" },
      { name: "Klaas Jansen", positionLabel: "CB", x: 38, y: 75, overall: 72, cardTier: "silver" },
      { name: "Willem Visser", positionLabel: "CB", x: 62, y: 75, overall: 78, cardTier: "silver" },
      { name: "Henk Smit", positionLabel: "RB", x: 85, y: 70, overall: 65, cardTier: "bronze" },
      { name: "Tom Mulder", positionLabel: "CM", x: 30, y: 50, overall: 80, cardTier: "silver" },
      { name: "Bas de Groot", positionLabel: "CM", x: 50, y: 55, overall: 82, cardTier: "silver" },
      { name: "Sander Bos", positionLabel: "CM", x: 70, y: 50, overall: 77, cardTier: "silver" },
      { name: "Marco Peters", positionLabel: "LW", x: 20, y: 25, overall: 85, cardTier: "gold" },
      { name: "Ahmed El Amrani", positionLabel: "ST", x: 50, y: 20, overall: 88, cardTier: "gold" },
      { name: "Dennis Kuijt", positionLabel: "RW", x: 80, y: 25, overall: 83, cardTier: "silver" },
    ],
    benchNames: ["Van Dijk", "De Jong", "Bergkamp"],
  },
};

export const WithoutRatings: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "Ajax B2",
    matchDate: "2026-03-22T10:00:00",
    formation: "4-3-3",
    players: [
      { name: "Jan de Vries", positionLabel: "K", x: 50, y: 90 },
      { name: "Pieter Bakker", positionLabel: "LB", x: 15, y: 70 },
      { name: "Klaas Jansen", positionLabel: "CB", x: 38, y: 75 },
      { name: "Willem Visser", positionLabel: "CB", x: 62, y: 75 },
      { name: "Henk Smit", positionLabel: "RB", x: 85, y: 70 },
      { name: "Tom Mulder", positionLabel: "CM", x: 30, y: 50 },
      { name: "Bas de Groot", positionLabel: "CM", x: 50, y: 55 },
      { name: "Sander Bos", positionLabel: "CM", x: 70, y: 50 },
      { name: "Marco Peters", positionLabel: "LW", x: 20, y: 25 },
      { name: "Ahmed El Amrani", positionLabel: "ST", x: 50, y: 20 },
      { name: "Dennis Kuijt", positionLabel: "RW", x: 80, y: 25 },
    ],
    benchNames: [],
  },
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 5: Commit**

```bash
git add src/components/molecules/ShareLineupCard/
git commit -m "feat: add ShareLineupCard component for lineup image sharing"
```

---

## Task 5: Add Share Button to LineupView

**Files:**
- Modify: `src/components/organisms/LineupView/LineupView.tsx`

**Step 1: Add share functionality to LineupView**

Import dependencies at the top:

```typescript
import { useRef } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import { useShareImage } from "@/hooks/use-share-image";
import { useMatch } from "@/hooks/use-matches";
```

Add inside the component, after the data setup:

```typescript
const shareRef = useRef<HTMLDivElement>(null);
const { share, isGenerating } = useShareImage();
```

Build the share player data from positions + playerMap:

```typescript
const sharePlayers = positions.map((pos) => {
  const player = playerMap.get(pos.player_id);
  const slot = formationSlots.find((s) => s.x === pos.x && s.y === pos.y);
  const cardProps = player ? getPlayerCardProps(player, slot?.position_label ?? "") : {};
  return {
    name: player?.name ?? "?",
    positionLabel: slot?.position_label ?? "",
    x: pos.x,
    y: pos.y,
    overall: cardProps.overall ?? null,
    cardTier: cardProps.cardTier ?? null,
  };
});

const benchPlayerNames = allPlayers
  .filter((p) => !positions.some((pos) => pos.player_id === p.id) && p.role !== "staff")
  .map((p) => p.name.split(" ").pop() ?? p.name)
  .slice(0, 5);
```

Add a share button in the UI and a hidden share card:

```tsx
<div className="flex items-center justify-between">
  <p className="text-sm text-muted-foreground">Formatie: {formation}</p>
  <Button
    variant="ghost"
    size="sm"
    className="gap-1.5"
    onClick={() => shareRef.current && share(shareRef.current, `opstelling-${matchId}`)}
    disabled={isGenerating}
  >
    <Share2 className="size-4" />
    {isGenerating ? "Genereren..." : "Delen"}
  </Button>
</div>

{/* Hidden share card */}
<div className="fixed -left-[9999px] top-0">
  <div ref={shareRef}>
    <ShareLineupCard
      teamName={currentTeam?.name ?? "Team"}
      opponent={matchOpponent}
      matchDate={matchDate}
      formation={formation}
      players={sharePlayers}
      benchNames={benchPlayerNames}
    />
  </div>
</div>
```

Note: `LineupView` needs the `matchId` prop (already has it) plus `opponent` and `matchDate`. These should be passed from the parent page. Add optional props:

```typescript
interface LineupViewProps {
  matchId: string;
  matchOpponent?: string;
  matchDate?: string;
}
```

And update the parent (`src/app/(main)/matches/[id]/page.tsx`) to pass them:

```tsx
<LineupView matchId={match.id} matchOpponent={match.opponent} matchDate={match.match_date} />
```

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/components/organisms/LineupView/ src/app/\(main\)/matches/\[id\]/page.tsx
git commit -m "feat: add lineup image sharing via Web Share API"
```

---

## Task 6: Create ShareMatchReport Component

**Files:**
- Create: `src/components/molecules/ShareMatchReport/ShareMatchReport.tsx`
- Create: `src/components/molecules/ShareMatchReport/ShareMatchReport.stories.tsx`
- Create: `src/components/molecules/ShareMatchReport/index.ts`

**Step 1: Create the share-ready match report component**

Create `src/components/molecules/ShareMatchReport/ShareMatchReport.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface StatEntry {
  playerName: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

interface ShareMatchReportProps {
  teamName: string;
  opponent: string;
  homeAway: "home" | "away";
  matchDate: string;
  scoreHome: number;
  scoreAway: number;
  stats: StatEntry[];
  className?: string;
}

export function ShareMatchReport({
  teamName,
  opponent,
  homeAway,
  matchDate,
  scoreHome,
  scoreAway,
  stats,
  className,
}: ShareMatchReportProps) {
  const date = new Date(matchDate);
  const dateStr = date.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const homeName = homeAway === "home" ? teamName : opponent;
  const awayName = homeAway === "away" ? teamName : opponent;

  const goalScorers = stats.filter((s) => s.goals > 0);
  const assistMakers = stats.filter((s) => s.assists > 0);
  const yellowCards = stats.filter((s) => s.yellow_cards > 0);
  const redCards = stats.filter((s) => s.red_cards > 0);

  return (
    <div
      className={cn(
        "flex w-[540px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white",
        className
      )}
    >
      {/* Date */}
      <p className="text-center text-sm text-white/50">
        {dateStr} · {timeStr}
      </p>

      {/* Score */}
      <div className="my-4 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="text-lg font-semibold">{homeName}</span>
          <span className="text-4xl font-bold tabular-nums">
            {scoreHome} - {scoreAway}
          </span>
          <span className="text-lg font-semibold">{awayName}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        {goalScorers.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Doelpunten
            </h3>
            {goalScorers.map((s) => (
              <p key={s.playerName} className="text-sm text-white/80">
                {s.playerName} {s.goals > 1 ? `(${s.goals}x)` : ""}
              </p>
            ))}
          </div>
        )}

        {assistMakers.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Assists
            </h3>
            {assistMakers.map((s) => (
              <p key={s.playerName} className="text-sm text-white/80">
                {s.playerName} {s.assists > 1 ? `(${s.assists}x)` : ""}
              </p>
            ))}
          </div>
        )}

        {(yellowCards.length > 0 || redCards.length > 0) && (
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Kaarten
            </h3>
            {yellowCards.map((s) => (
              <p key={`y-${s.playerName}`} className="text-sm text-yellow-400">
                {s.playerName}
              </p>
            ))}
            {redCards.map((s) => (
              <p key={`r-${s.playerName}`} className="text-sm text-red-400">
                {s.playerName}
              </p>
            ))}
          </div>
        )}

        {goalScorers.length === 0 && assistMakers.length === 0 && yellowCards.length === 0 && redCards.length === 0 && (
          <p className="text-center text-sm text-white/40">Geen statistieken ingevuld.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/30">
        myteamplanner.nl
      </div>
    </div>
  );
}
```

**Step 2: Create barrel export**

Create `src/components/molecules/ShareMatchReport/index.ts`:

```typescript
export { ShareMatchReport } from "./ShareMatchReport";
```

**Step 3: Create stories**

Create `src/components/molecules/ShareMatchReport/ShareMatchReport.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareMatchReport } from "./ShareMatchReport";

const meta: Meta<typeof ShareMatchReport> = {
  title: "Molecules/ShareMatchReport",
  component: ShareMatchReport,
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareMatchReport>;

export const WithStats: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "SC Heerenveen",
    homeAway: "home",
    matchDate: "2026-03-15T14:30:00",
    scoreHome: 3,
    scoreAway: 1,
    stats: [
      { playerName: "Jan de Vries", goals: 2, assists: 0, yellow_cards: 0, red_cards: 0 },
      { playerName: "Pieter Bakker", goals: 1, assists: 0, yellow_cards: 0, red_cards: 0 },
      { playerName: "Willem Visser", goals: 0, assists: 2, yellow_cards: 0, red_cards: 0 },
      { playerName: "Klaas Jansen", goals: 0, assists: 0, yellow_cards: 1, red_cards: 0 },
    ],
  },
};

export const NoStats: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "Ajax B2",
    homeAway: "away",
    matchDate: "2026-03-08T10:00:00",
    scoreHome: 0,
    scoreAway: 2,
    stats: [],
  },
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 5: Commit**

```bash
git add src/components/molecules/ShareMatchReport/
git commit -m "feat: add ShareMatchReport component for match report sharing"
```

---

## Task 7: Add Match Report Sharing to Match Detail

**Files:**
- Modify: `src/app/(main)/matches/[id]/page.tsx`

**Step 1: Add share report functionality**

Import at the top:

```typescript
import { Share2, Copy } from "lucide-react";
import { useRef } from "react"; // add to existing import
import { ShareMatchReport } from "@/components/molecules/ShareMatchReport";
import { useShareImage } from "@/hooks/use-share-image";
import { useMatchStats } from "@/hooks/use-match-stats";
```

Inside the component, add:

```typescript
const { data: matchStats } = useMatchStats(match?.status === "completed" ? id : undefined);
const reportRef = useRef<HTMLDivElement>(null);
const { share: shareImage, isGenerating } = useShareImage();
```

Build stats for the report:

```typescript
const reportStats = (matchStats ?? []).map((s) => ({
  playerName: (s.players as { name: string })?.name ?? "Onbekend",
  goals: s.goals ?? 0,
  assists: s.assists ?? 0,
  yellow_cards: s.yellow_cards ?? 0,
  red_cards: s.red_cards ?? 0,
})).filter((s) => s.goals > 0 || s.assists > 0 || s.yellow_cards > 0 || s.red_cards > 0);
```

Add a "Deel verslag" section to completed matches, after the match stats editor:

```tsx
{match.status === "completed" && (
  <div className="rounded-xl bg-white p-4 shadow-md">
    <h2 className="mb-3 text-lg font-semibold">Verslag delen</h2>
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={() => {
          const homeName = match.home_away === "home" ? currentTeam?.name ?? "Thuis" : match.opponent;
          const awayName = match.home_away === "away" ? currentTeam?.name ?? "Uit" : match.opponent;
          const lines = [
            `${homeName} ${match.score_home} - ${match.score_away} ${awayName}`,
            formatMatchDate(match.match_date),
            "",
          ];
          const goals = reportStats.filter((s) => s.goals > 0);
          if (goals.length) {
            lines.push("Doelpunten:");
            goals.forEach((s) => lines.push(`  ${s.playerName}${s.goals > 1 ? ` (${s.goals}x)` : ""}`));
            lines.push("");
          }
          const assists = reportStats.filter((s) => s.assists > 0);
          if (assists.length) {
            lines.push("Assists:");
            assists.forEach((s) => lines.push(`  ${s.playerName}${s.assists > 1 ? ` (${s.assists}x)` : ""}`));
            lines.push("");
          }
          lines.push("myteamplanner.nl");
          navigator.clipboard.writeText(lines.join("\n"));
        }}
      >
        <Copy className="size-4" />
        Kopieer tekst
      </Button>
      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={() => reportRef.current && shareImage(reportRef.current, `verslag-${match.opponent}`)}
        disabled={isGenerating}
      >
        <Share2 className="size-4" />
        {isGenerating ? "Genereren..." : "Deel afbeelding"}
      </Button>
    </div>

    {/* Hidden report card */}
    <div className="fixed -left-[9999px] top-0">
      <div ref={reportRef}>
        <ShareMatchReport
          teamName={currentTeam?.name ?? "Team"}
          opponent={match.opponent}
          homeAway={match.home_away}
          matchDate={match.match_date}
          scoreHome={match.score_home ?? 0}
          scoreAway={match.score_away ?? 0}
          stats={reportStats}
        />
      </div>
    </div>
  </div>
)}
```

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/app/\(main\)/matches/\[id\]/page.tsx
git commit -m "feat: add match report sharing with text and image options"
```

---

## Task 8: Final Verification & Cleanup

**Step 1: Full build check**

Run: `npm run build`
Expected: No errors

**Step 2: Lint check**

Run: `npm run lint`
Expected: 0 errors

**Step 3: Full test suite**

Run: `npm run test`
Expected: All tests pass

**Step 4: Visual verification in Storybook**

Run: `npm run storybook`
Check: ShareLineupCard and ShareMatchReport render correctly

**Step 5: Commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: share features polish and cleanup"
```
