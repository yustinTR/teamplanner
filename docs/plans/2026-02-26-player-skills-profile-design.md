# Speler Vaardigheden-profiel

## Probleem

Coaches hebben geen gestructureerde manier om vaardigheden van spelers bij te houden. Het huidige `notes`-veld is vrije tekst zonder structuur. Er is geen visueel overzicht van sterke en zwakke punten — alles zit in het hoofd van de coach.

## Oplossing

Een vaardigheden-profiel per speler met 10 scores (1–10) weergegeven als radardiagram op de spelersdetailpagina. Alleen de coach kan scores invullen via een bottom sheet met sliders. Iedereen kan het diagram bekijken.

---

## Datamodel

Nieuwe JSONB kolom op de bestaande `players` tabel:

```sql
ALTER TABLE players ADD COLUMN skills jsonb DEFAULT '{}';
```

Opgeslagen als:
```json
{
  "speed": 7,
  "strength": 5,
  "technique": 8,
  "passing": 6,
  "dribbling": 7,
  "heading": 4,
  "defending": 3,
  "positioning": 6,
  "finishing": 8,
  "stamina": 7
}
```

Geen historie — één set scores per speler, overschrijfbaar door de coach.

### 10 vaardigheden

| Key | Label (NL) |
|-----|-----------|
| `speed` | Snelheid |
| `strength` | Kracht |
| `technique` | Techniek |
| `passing` | Passing |
| `dribbling` | Dribbelen |
| `heading` | Koppen |
| `defending` | Verdedigen |
| `positioning` | Positiespel |
| `finishing` | Afwerken |
| `stamina` | Conditie |

Gedefinieerd als constante `PLAYER_SKILLS` in `src/lib/constants.ts`.

---

## UI

### Radardiagram op spelersdetailpagina

Het vaardigheden-profiel verschijnt op de `PlayerDetail` pagina, tussen de spelersinfo en de seizoensstatistieken:

1. **Header** (naam, positie, rugnummer) — bestaand
2. **Vaardigheden-profiel** — nieuw radardiagram
3. **Seizoensstatistieken** — bestaand

**Weergave:**
- Recharts `RadarChart` met `PolarGrid`, `PolarAngleAxis`, `Radar`
- Gevuld vlak in semi-transparante primary-kleur
- Labels rondom de grafiek (Nederlandse namen)
- Schaal 0–10 (verborgen, alleen grid-lijnen)
- Responsive: vult beschikbare breedte

**Leeg state:**
- Als `skills` leeg is (`{}`): tekst "Nog geen vaardigheden beoordeeld" + "Beoordelen" knop (alleen voor coach)

**Wie ziet wat:**
- Iedereen ziet het radardiagram (read-only)
- Alleen de coach ziet de "Bewerken" knop

### Score-invoer via bottom sheet

Coach tikt op "Bewerken" knop naast het radardiagram:

- Opent een `Sheet` (zelfde patroon als bestaande PlayerForm sheet)
- Titel: "Vaardigheden beoordelen"
- Per vaardigheid: label + slider (1–10) + huidige waarde als getal
- "Opslaan" knop onderaan
- Bij opslaan: `useUpdatePlayer({ id, skills: { speed: 7, ... } })`

---

## Technisch overzicht

### Nieuwe bestanden

| Bestand | Type | Doel |
|---------|------|------|
| `src/components/molecules/SkillsRadar/SkillsRadar.tsx` | Molecule | Recharts RadarChart, read-only |
| `src/components/molecules/SkillsRadar/SkillsRadar.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/SkillsRadar/index.ts` | Barrel | Export |
| `src/components/molecules/SkillsEditor/SkillsEditor.tsx` | Molecule | Bottom sheet met sliders |
| `src/components/molecules/SkillsEditor/SkillsEditor.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/SkillsEditor/index.ts` | Barrel | Export |

### Bestaande bestanden die wijzigen

| Bestand | Wijziging |
|---------|-----------|
| `supabase/migrations/xxx_add_player_skills.sql` | `ALTER TABLE players ADD COLUMN skills jsonb DEFAULT '{}'` |
| `src/lib/supabase/types.ts` | Regenereren na migratie |
| `src/lib/constants.ts` | `PLAYER_SKILLS` constante toevoegen |
| `src/components/organisms/PlayerDetail/PlayerDetail.tsx` | SkillsRadar + SkillsEditor integreren |

### Geen nieuwe hooks

`useUpdatePlayer()` accepteert al willekeurige kolommen via `PlayerUpdate` type. Na het regenereren van Supabase types zal `skills` automatisch beschikbaar zijn.

### Dependencies

- `recharts` toevoegen via `npm install recharts`
- Shadcn `Slider` component toevoegen via `npx shadcn@latest add slider` (als het nog niet bestaat)

### Geen nieuwe database-tabellen

Alles via de bestaande `players` tabel + JSONB kolom.
