# V2 Design — Automatische sync, push-notificaties & seizoensdashboard

> Implementatieplan voor de V2-kern. Sluit aan op fase 2 ("Speler-statistieken") en de
> automatiserings-visie uit `2026-02-26-coach-autopilot-roadmap-design.md`.

## Doel

Drie features die elkaar versterken:

1. **Automatische seizoen-sync** — de app houdt zichzelf actueel (programma, tijden, uitslagen)
2. **Push-notificaties** — spelers worden actief teruggehaald naar de app
3. **Speeltijd- & seizoensdashboard** — inzicht dat nu alleen in het hoofd van de coach zit

Samenhang: sync detecteert wijzigingen → push meldt ze → dashboard maakt de verzamelde data zichtbaar.

---

## Fase 1: Automatische seizoen-sync

### Probleem

Wedstrijddata wordt nu eenmalig geïmporteerd via team-instellingen. Tijdwijzigingen (KNVB), nieuwe
speelrondes en uitslagen komen niet vanzelf binnen — de coach moet handmatig opnieuw importeren.

### Oplossing

Een dagelijkse Vercel Cron die voor alle teams met een gekoppelde importbron
(`teams.import_club_abbrev` + `import_team_name`) het programma en de uitslagen ververst via de
VoetbalAssist API. De parser (`src/lib/voetbal-nl-parser.ts`) draait al server-side in Next.js en
wordt hergebruikt — géén aparte Deno edge function nodig.

### Architectuur

```
Vercel Cron (dagelijks 06:00) ──> GET /api/cron/sync-matches  (Authorization: Bearer CRON_SECRET)
                                        │
                                        ├─ teams met import-bron ophalen (service-role client)
                                        ├─ per club (gededupliceerd): getMatchesFromApi + getLocationsFromIcal
                                        ├─ per team: upsert wedstrijden + uitslagen verwerken
                                        └─ wijzigingen verzamelen → sync_log (+ trigger voor push, fase 2)
```

### Werkzaamheden

1. **Migration** — `teams` uitbreiden:
   - `auto_sync_enabled boolean not null default true`
   - `last_synced_at timestamptz`
   - Nieuwe tabel `sync_log (id, team_id, run_at, matches_created, matches_updated, results_updated, changes jsonb)`
     voor debugging en als bron voor notificaties.
2. **Service-role client** — `src/lib/supabase/admin.ts` met `SUPABASE_SERVICE_ROLE_KEY`
   (server-only, nooit in client bundles). Nodig omdat cron geen user-sessie heeft en RLS anders blokkeert.
3. **Gedeelde sync-logica** — upsert-logica uit `api/import-voetbal-nl/confirm/route.ts` extraheren naar
   `src/lib/match-sync.ts` (client wordt geïnjecteerd, zodat confirm-route en cron dezelfde code gebruiken):
   - Dedupe: zelfde tegenstander (case-insensitive) + zelfde dag → update `match_date`, `home_away`, `location`
   - Nieuw → insert met `status: 'upcoming'`
   - Uitslagen → `score_home`/`score_away` + `status: 'completed'` (alleen als score nog leeg is,
     handmatig ingevoerde scores niet overschrijven)
4. **Cron route** — `src/app/api/cron/sync-matches/route.ts`:
   - Verifieert `Authorization: Bearer ${CRON_SECRET}`
   - Dedupliceert clubs (meerdere teams van dezelfde club → 1 API-call), sequentieel per club (netjes voor de API)
   - Retourneert samenvatting; fouten per team loggen, niet de hele run laten falen
5. **`vercel.json`** — cron config: `{"crons": [{"path": "/api/cron/sync-matches", "schedule": "0 5 * * *"}]}`
6. **UI** — in team-instellingen (importpagina): toggle "Automatisch synchroniseren" + "Laatste sync: …"

### Envs

`SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` (toevoegen aan Vercel + `.env.local`, opnemen in `src/lib/env.ts`
als server-only schema).

### Testen

- Unit tests voor `match-sync.ts` met gemockte Supabase client en API-responses
- Handmatig triggeren: `curl -H "Authorization: Bearer $CRON_SECRET" .../api/cron/sync-matches`

---

## Fase 2: Push-notificaties

### Probleem

Spelers moeten zelf de app openen om te zien dat er iets is (nieuwe wedstrijd, opstelling online,
beschikbaarheid nog niet doorgegeven). Dat is precies waarom WhatsApp nu wint: het pusht.

### Oplossing

Web Push (VAPID) via de bestaande Serwist service worker. Drie triggers in v1:

| Trigger | Ontvanger | Moment |
|---|---|---|
| Beschikbaarheids-reminder | Spelers zonder respons | Dagelijks 18:00, wedstrijd < 3 dagen |
| Opstelling gepubliceerd | Geselecteerde spelers | Bij opslaan lineup |
| Wedstrijd gewijzigd/nieuw | Hele team | Vanuit sync (fase 1) |

### Werkzaamheden

1. **Migration** — `push_subscriptions (id, user_id references auth.users, endpoint text unique, p256dh text, auth text, user_agent text, created_at)` met RLS: gebruiker beheert alleen eigen rijen.
2. **VAPID keys** — genereren met `npx web-push generate-vapid-keys` →
   `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` (server-only).
3. **Dependency** — `web-push` (server-side verzending).
4. **Service worker** (`src/app/sw.ts`) — `push` listener (`showNotification` met title/body/`data.url`)
   en `notificationclick` (bestaand tabblad focussen of `data.url` openen).
5. **Server-lib** — `src/lib/push.ts`: `sendPushToUsers(userIds, payload)` — subscriptions ophalen,
   versturen, `410 Gone` subscriptions opruimen.
6. **API routes**:
   - `api/push/subscribe` — POST (opslaan) / DELETE (verwijderen), authenticated
   - `api/cron/availability-reminders` — Vercel Cron dagelijks 17:00 UTC: wedstrijden binnen 3 dagen,
     spelers mét `user_id` maar zónder availability-respons → reminder
   - `api/push/lineup-published` — aangeroepen vanuit de lineup-save flow (coach-actie), verifieert coach-rol
7. **UI** — `PushNotificationSettings` molecule op de profielpagina: permission flow
   (`Notification.requestPermission` → `pushManager.subscribe`), aan/uit-toggle.
   iOS-hint tonen: push werkt op iOS (16.4+) alleen als de PWA op het beginscherm staat.
8. **Sync-koppeling** — fase 1 cron roept na afloop `sendPushToUsers` aan voor teams met wijzigingen
   ("Wedstrijd tegen SEV G3 verplaatst naar 09:45").

### Scope-bewaking

Geen per-categorie voorkeuren in v1 (subscription = alles aan). Geen e-mail fallback. Simpel houden.

### Testen

- Stories voor `PushNotificationSettings` (alle states: default, granted, denied, unsupported)
- Handmatige e2e: subscribe op telefoon → cron handmatig triggeren → notificatie ontvangen

---

## Fase 3: Speeltijd- & seizoensdashboard

### Probleem

Zie roadmap fase 2: geen inzicht in wie hoeveel speelt (cruciaal bij G-voetbal), wie scoort,
wie vaak afwezig is. De data bestaat al (`match_stats`, `substitution_plan.playerMinutes`,
`availability`) maar is alleen per individuele speler zichtbaar.

### Oplossing

Een team-breed statistieken-dashboard op `/team/stats`, bereikbaar vanaf de teampagina.

### Onderdelen

1. **Speeltijd-fairness chart** (de hoofdattractie) — horizontale bar chart (Recharts, al in de stack)
   met totale minuten per speler + teamgemiddelde-lijn. Kleurcodering: ver onder gemiddelde valt op.
2. **Topscorers & assists** — ranglijst met spelersfoto's (PlayerChip hergebruiken)
3. **Aanwezigheid** — respons- en aanwezigheids-% per speler over het seizoen
4. **Stat tiles** — totalen: gespeelde wedstrijden, W/G/V, doelpunten voor/tegen (uit `matches.score_*`)

### Werkzaamheden

1. **Hook** — `use-team-season-stats`: alle spelers + completed matches + lineups + match_stats +
   availability in parallelle queries; aggregatie via bestaand `aggregatePlayerStats`
   (`src/lib/player-stats-utils.ts`, werkt al team-breed) + nieuwe `aggregateAttendance` utility.
2. **Componenten** (elk met stories, verplicht):
   - `organisms/TeamStatsDashboard` — data via hook, layout
   - `molecules/MinutesFairnessChart` — Recharts bar chart, mobile-first (375px)
   - `molecules/TopScorersList`
   - `molecules/AttendanceOverview`
3. **Page** — `src/app/(main)/team/stats/page.tsx` + link/kaart op de teampagina
4. **Lege staat** — EmptyState zolang er geen completed matches zijn ("Statistieken verschijnen na je eerste wedstrijd")

> Bij het bouwen van de charts eerst de `dataviz` skill laden (kleuren, dark mode, toegankelijkheid).

### Testen

- Unit tests voor `aggregateAttendance`
- Stories met realistische seed-data (vol team, leeg team, 1 wedstrijd)

---

## Volgorde & inschatting

| Fase | Afhankelijkheid | Omvang |
|---|---|---|
| 1. Sync | — | ~1 sessie (migration, lib-refactor, cron route, toggle-UI, tests) |
| 2. Push | Fase 1 voor de wijzigings-trigger (reminders kunnen eerder) | ~1–2 sessies (SW, subscribe-flow, 3 triggers, UI) |
| 3. Dashboard | Onafhankelijk, kan parallel | ~1 sessie (hook, 4 componenten + stories, page) |

Aanbevolen volgorde: 1 → 3 → 2. Het dashboard is direct zichtbaar resultaat en heeft geen
infrastructuur-afhankelijkheden; push heeft de meeste bewegende delen (VAPID keys, iOS-gedrag,
device-testen) en profiteert ervan als de sync al wijzigingen logt.

## Pre-commit checklist (per fase)

`npm run build` · `npm run lint` · `npm run test` · nieuwe componenten visueel checken in Storybook.
