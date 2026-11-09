/**
 * Landing pages per match format for the free tools
 * (`/tools/wisselschema/<slug>` and `/tools/opstelling/<slug>`).
 * Youth facts follow the KNVB infographics for 6 tegen 6 (season 2024/'25)
 * and 8 tegen 8 (season 2025/'26).
 */
export interface FormationTip {
  formation: string;
  tip: string;
}

export interface FormatPage {
  slug: string;
  /** "8 tegen 8" */
  name: string;
  /** "JO11 en JO12" */
  audience: string;
  /** MATCH_FORMATS key the tools start on. */
  toolFormat: string;
  facts: string[];
  formations: FormationTip[];
  /** Worked example for the schedule page. */
  scheduleExample: string;
  scheduleKeywords: string[];
  lineupKeywords: string[];
  faq: { question: string; answer: string }[];
}

export const FORMAT_PAGES: FormatPage[] = [
  {
    slug: "8-tegen-8",
    name: "8 tegen 8",
    audience: "JO11 en JO12",
    toolFormat: "jo12_jo11",
    facts: [
      "Voor JO11, MO11 en JO12 (KNVB-pupillenvoetbal).",
      "Een keeper en zeven veldspelers per team.",
      "Speeltijd 2x 30 minuten, met halverwege elke helft een time-out van maximaal 2 minuten.",
      "Veld van 64 bij 42,5 meter, maat 5-bal, strafschop op 9 meter.",
    ],
    formations: [
      { formation: "3-3-1", tip: "De meest gebruikte opstelling: drie verdedigers, drie middenvelders en een spits. Stevig achterin en iedereen heeft een duidelijke rol." },
      { formation: "2-3-2", tip: "Twee spitsen voor teams die veel willen aanvallen. Vraagt middenvelders die ook mee terug verdedigen." },
      { formation: "2-4-1", tip: "Een breed middenveld met vier spelers: veel balcontacten in het midden, goed voor teams die combinaties willen leren." },
      { formation: "3-2-2", tip: "Drie verdedigers en twee spitsen; het middenveld moet veel lopen. Handig tegen een sterke tegenstander met snelle aanvallers." },
    ],
    scheduleExample:
      "Met tien spelers heb je een keeper en negen veldspelers voor zeven plekken: 7 x 60 = 420 veldminuten, gemiddeld ruim 46 per speler. Wissel na 12, 24, 36 en 48 minuten telkens twee spelers; acht spelers spelen dan 48 minuten en één speler 36. Laat die extra bankbeurt elke week bij iemand anders vallen.",
    scheduleKeywords: ["wisselschema 8 tegen 8", "wisselschema JO11", "wisselschema JO12", "speeltijd verdelen 8 tegen 8"],
    lineupKeywords: ["opstelling 8 tegen 8", "opstelling JO11", "opstelling JO12", "formatie 8 tegen 8", "3-3-1 opstelling"],
    faq: [
      {
        question: "Hoe lang duurt een wedstrijd 8 tegen 8?",
        answer: "Bij de KNVB 2x 30 minuten, met halverwege elke helft een time-out van maximaal 2 minuten.",
      },
      {
        question: "Welke formatie is het best bij 8 tegen 8?",
        answer: "De 3-3-1 is het meest gebruikt omdat hij overzichtelijk is. Wil je meer aanvallen, kies dan 2-3-2; wil je veel combineren, dan 2-4-1.",
      },
      {
        question: "Hoeveel wissels heb ik nodig met tien spelers?",
        answer: "Met negen veldspelers voor zeven plekken zitten er steeds twee op de bank. Vier wisselmomenten van twee spelers geeft een eerlijk schema; de tool rekent het voor je uit.",
      },
    ],
  },
  {
    slug: "6-tegen-6",
    name: "6 tegen 6",
    audience: "JO8, JO9 en JO10",
    toolFormat: "jo10",
    facts: [
      "Voor JO8, JO9 en JO10 (KNVB-pupillenvoetbal).",
      "Een keeper en vijf veldspelers per team.",
      "Speeltijd 2x 20 minuten voor JO8 en JO9, 2x 25 minuten voor JO10, met halverwege elke helft een time-out van maximaal 2 minuten.",
      "Veld van 42,5 bij 30 meter met pupillendoelen van 5 bij 2 meter.",
    ],
    formations: [
      { formation: "2-2-1", tip: "Twee verdedigers, twee middenvelders en een spits: de standaard en het makkelijkst uit te leggen aan jonge spelers." },
      { formation: "1-3-1", tip: "Eén laatste man en drie middenvelders: veel spelers rond de bal, goed voor balbezit en voor teams die het middenveld willen winnen." },
      { formation: "2-1-2", tip: "Twee spitsen voor meer kansen. De middenvelder heeft veel werk; wissel die rol vaak." },
    ],
    scheduleExample:
      "Bij JO10 (2x 25 minuten) met negen spelers heb je een keeper en acht veldspelers voor vijf plekken: steeds drie op de bank. Wissel vaak en in kleine groepjes, zodat niemand lang stilzit; de tool kiest het aantal wisselmomenten waarbij het verschil in speeltijd het kleinst is.",
    scheduleKeywords: ["wisselschema 6 tegen 6", "wisselschema JO8", "wisselschema JO9", "wisselschema JO10"],
    lineupKeywords: ["opstelling 6 tegen 6", "opstelling JO8", "opstelling JO9", "opstelling JO10", "formatie 6 tegen 6"],
    faq: [
      {
        question: "Hoe lang duurt een wedstrijd 6 tegen 6?",
        answer: "Bij de KNVB 2x 20 minuten voor JO8 en JO9 en 2x 25 minuten voor JO10, met halverwege elke helft een time-out van maximaal 2 minuten.",
      },
      {
        question: "Welke opstelling gebruik je bij 6 tegen 6?",
        answer: "Meestal 2-2-1. Met 1-3-1 heb je meer spelers op het middenveld en met 2-1-2 meer aanvallers.",
      },
      {
        question: "Moet de keeper ook wisselen?",
        answer: "Bij de jongste jeugd is het goed als iedereen een keer keept. De tool laat de eerste speler de hele wedstrijd keepen; wil je de keeper halverwege wisselen, maak dan voor elke helft een eigen schema.",
      },
    ],
  },
  {
    slug: "11-tegen-11",
    name: "11 tegen 11",
    audience: "JO13 en ouder, en senioren",
    toolFormat: "jo13",
    facts: [
      "Vanaf JO13 spelen jeugdteams 11 tegen 11 op een heel veld.",
      "Een keeper en tien veldspelers per team.",
      "Speeltijd voor JO13 2x 30 minuten, oplopend tot 2x 45 minuten bij de senioren.",
    ],
    formations: [
      { formation: "4-3-3", tip: "Vier verdedigers, drie middenvelders, drie aanvallers: de klassieke opstelling met veel breedte voorin." },
      { formation: "4-4-2", tip: "Twee spitsen en een vlak middenveld van vier: overzichtelijk en stevig." },
      { formation: "3-5-2", tip: "Een druk middenveld met vleugelverdedigers; vraagt conditie op de flanken." },
      { formation: "4-2-3-1", tip: "Twee controleurs voor de verdediging en een aanvallende middenvelder achter de spits." },
    ],
    scheduleExample:
      "Bij JO13 (2x 30 minuten) met veertien spelers heb je een keeper en dertien veldspelers voor tien plekken: steeds drie op de bank. Met vier of vijf wisselmomenten speelt iedereen rond de 46 minuten.",
    scheduleKeywords: ["wisselschema 11 tegen 11", "wisselschema JO13", "wisselschema JO15", "wisselschema voetbal"],
    lineupKeywords: ["opstelling 11 tegen 11", "opstelling JO13", "voetbal opstelling 4-3-3", "formatie 11 tegen 11"],
    faq: [
      {
        question: "Vanaf welke leeftijd speel je 11 tegen 11?",
        answer: "Vanaf JO13. Daarvoor spelen JO11 en JO12 8 tegen 8 en JO8 tot en met JO10 6 tegen 6.",
      },
      {
        question: "Hoeveel wissels mag je doen?",
        answer: "In het amateurvoetbal mag je bij de jeugd doorgaans onbeperkt wisselen. Kijk voor de regels van jouw competitie in het reglement van je district.",
      },
    ],
  },
  {
    slug: "7-tegen-7",
    name: "7 tegen 7",
    audience: "7x7-competities, toernooien en G-voetbal",
    toolFormat: "7x7",
    facts: [
      "7 tegen 7 speel je op een half veld, bijvoorbeeld in 7x7-competities voor senioren en veteranen, op toernooien en bij G-voetbal.",
      "Een keeper en zes veldspelers per team.",
      "Let op: in de KNVB-jeugdcompetitie spelen JO8 tot en met JO10 6 tegen 6 en JO11 en JO12 8 tegen 8.",
    ],
    formations: [
      { formation: "2-3-1", tip: "De meest gebruikte opstelling: een sterk middenveld van drie en één spits." },
      { formation: "3-2-1", tip: "Drie verdedigers voor teams die eerst de nul willen houden." },
      { formation: "2-2-2", tip: "Twee spitsen voor meer druk naar voren." },
    ],
    scheduleExample:
      "Met negen spelers heb je een keeper en acht veldspelers voor zes plekken: steeds twee op de bank. Met vier gelijke periodes zit iedereen precies één keer op de bank en speelt iedereen even lang.",
    scheduleKeywords: ["wisselschema 7 tegen 7", "wisselschema 7x7", "wisselschema toernooi"],
    lineupKeywords: ["opstelling 7 tegen 7", "opstelling 7x7", "formatie 7 tegen 7"],
    faq: [
      {
        question: "Speelt de KNVB-jeugd 7 tegen 7?",
        answer: "Nee. JO8 tot en met JO10 spelen 6 tegen 6, JO11 en JO12 8 tegen 8 en vanaf JO13 11 tegen 11. 7 tegen 7 kom je tegen bij 7x7-competities, toernooien en G-voetbal.",
      },
    ],
  },
];

export function getFormatPage(slug: string): FormatPage | undefined {
  return FORMAT_PAGES.find((p) => p.slug === slug);
}
