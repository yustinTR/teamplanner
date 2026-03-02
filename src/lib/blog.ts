export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  featureLink: string;
  featureLabel: string;
  keywords: string[];
  sections: BlogSection[];
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "opstelling-7-tegen-7-voetbal",
    title: "Opstelling 7 tegen 7 voetbal: de beste formaties en tips",
    description:
      "Welke formaties werken het beste bij 7 tegen 7? Van 2-3-1 tot 3-2-1 — ontdek de beste opstellingen voor jeugdvoetbal met praktische tips voor coaches.",
    date: "2026-02-28",
    readingTime: "5 min",
    featureLink: "/features/opstellingen",
    featureLabel: "Opstellingen maken",
    keywords: ["opstelling 7 tegen 7", "formatie 7v7", "jeugdvoetbal opstelling", "7 tegen 7 formaties"],
    sections: [
      {
        heading: "Waarom 7 tegen 7?",
        paragraphs: [
          "Bij de KNVB spelen teams in de JO11 en JO9 categorie op een kleiner veld met 7 spelers. Dit formaat is ideaal om jonge spelers meer balbezit te geven en tactisch inzicht te ontwikkelen. Elke speler raakt de bal vaker dan bij 11v11, wat de technische ontwikkeling versnelt.",
          "Als coach is het belangrijk om een formatie te kiezen die past bij het niveau van je team. Hieronder bespreken we de meest gebruikte opstellingen.",
        ],
      },
      {
        heading: "De 2-3-1 formatie",
        paragraphs: [
          "De 2-3-1 is de meest populaire formatie voor 7v7. Je speelt met een keeper, 2 verdedigers, 3 middenvelders en 1 spits. Het voordeel: een sterk middenveld dat zowel kan aanvallen als verdedigen.",
          "Deze formatie werkt goed als je spelers hebt die graag combineren. De buitenste middenvelders schuiven mee naar voren bij balbezit en zakken terug bij balverlies.",
        ],
      },
      {
        heading: "De 3-2-1 formatie",
        paragraphs: [
          "Met 3 verdedigers, 2 middenvelders en 1 spits kies je voor meer defensieve zekerheid. Ideaal voor teams die nog aan het leren zijn en vaker de bal verliezen.",
          "De 3 verdedigers geven rust aan de opbouw. De buitenste verdedigers kunnen bij balbezit opschuiven als vleugelverdediger, waardoor je alsnog breedte creëert.",
        ],
      },
      {
        heading: "De 2-2-2 formatie",
        paragraphs: [
          "Een gebalanceerde formatie met 2 verdedigers, 2 middenvelders en 2 aanvallers. Werkt goed als je twee sterke spitsen hebt die samen druk kunnen zetten.",
          "Let op: het middenveld kan leeg aanvoelen als de middenvelders niet goed doorschuiven. Zorg dat ze weten wanneer ze moeten aansluiten bij de aanval of terug moeten zakken.",
        ],
      },
      {
        heading: "Tips voor de coach",
        paragraphs: [
          "Laat spelers op verschillende posities spelen — zeker bij jeugdteams. Dit bevordert de algehele ontwikkeling. Een verdediger die ook weleens spits speelt, begrijpt beter hoe aanvallers denken.",
          "Gebruik wisselschema's om ervoor te zorgen dat iedereen evenveel speeltijd krijgt. Bij jeugdvoetbal is eerlijke speeltijdverdeling belangrijker dan winnen. Met een tool als MyTeamPlanner plan je wissels vooraf en zie je automatisch hoeveel minuten elke speler maakt.",
        ],
      },
    ],
  },
  {
    slug: "wisselschema-jeugdvoetbal",
    title: "Wisselschema jeugdvoetbal: eerlijke speeltijd voor iedereen",
    description:
      "Hoe maak je een eerlijk wisselschema voor je jeugdteam? Praktische tips en een stapsgewijze aanpak voor coaches die elke speler evenveel speeltijd willen geven.",
    date: "2026-02-25",
    readingTime: "4 min",
    featureLink: "/features/opstellingen",
    featureLabel: "Wisselschema maken",
    keywords: ["wisselschema jeugdvoetbal", "speeltijd verdelen", "eerlijk wisselen voetbal", "wisselschema maken"],
    sections: [
      {
        heading: "Waarom eerlijke speeltijd belangrijk is",
        paragraphs: [
          "Bij jeugdvoetbal draait het niet om winnen — het draait om ontwikkeling. De KNVB adviseert coaches om alle spelers evenveel speeltijd te geven, ongeacht hun niveau. Spelers die op de bank zitten, leren niets en verliezen hun motivatie.",
          "Toch is het in de praktijk lastig. Met 14 spelers en 7 plekken moet je goed plannen. Een wisselschema helpt je om vooraf te bepalen wie wanneer speelt.",
        ],
      },
      {
        heading: "Stap 1: Bepaal je wisselmomenten",
        paragraphs: [
          "Bij een wedstrijd van 2x 25 minuten kun je bijvoorbeeld wisselen na 12, 25 en 37 minuten. Dat geeft je 4 speelperiodes. Met 14 spelers en 7 posities kun je dan in elke periode andere spelers laten spelen.",
          "Houd het simpel: wissel per periode 2-3 spelers tegelijk. Zo houd je structuur in het team en voorkom je dat alles door elkaar loopt.",
        ],
      },
      {
        heading: "Stap 2: Verdeel de minuten",
        paragraphs: [
          "Tel het totaal aantal speelminuten: 7 posities x 50 minuten = 350 speelminuten. Deel dit door 14 spelers = 25 minuten per speler. In de praktijk is het niet altijd exact gelijk, maar streef naar maximaal 5 minuten verschil.",
          "Houd bij hoeveel minuten elke speler over het seizoen maakt. Zo kun je compenseren als iemand een keer minder heeft gespeeld.",
        ],
      },
      {
        heading: "Stap 3: Maak het visueel",
        paragraphs: [
          "Een wisselschema op papier is snel onoverzichtelijk. Gebruik een tool die automatisch berekent hoeveel minuten elke speler speelt bij jouw geplande wissels.",
          "In MyTeamPlanner stel je wisselmomenten in via de lineup-editor. Je sleept spelers naar het veld, plant wanneer ze gewisseld worden, en ziet direct een balkje met de speeltijdverdeling. Zo weet je voor de wedstrijd al of het eerlijk verdeeld is.",
        ],
      },
    ],
  },
  {
    slug: "team-managen-als-voetbaltrainer",
    title: "Team managen als voetbaltrainer: van WhatsApp naar overzicht",
    description:
      "Herkenbaar? Eindeloze WhatsApp-berichten over wie er kan spelen. Ontdek hoe je als amateurvoetbalcoach je team efficiënt beheert met een teamplanner.",
    date: "2026-02-20",
    readingTime: "4 min",
    featureLink: "/features/wedstrijden",
    featureLabel: "Wedstrijden beheren",
    keywords: ["team managen voetbal", "voetbaltrainer app", "team beheren", "coach app voetbal"],
    sections: [
      {
        heading: "Het WhatsApp-probleem",
        paragraphs: [
          "Elke amateurvoetbalcoach kent het: je stuurt woensdag een bericht in de groep \"Wie kan er zaterdag?\" en dan begint het wachten. Drie spelers reageren meteen, vijf lezen het bericht maar zeggen niets, en de rest heeft de melding gemist.",
          "Vrijdagavond weet je nog steeds niet of je genoeg spelers hebt. Je begint privéberichten te sturen. \"Hé, kun je zaterdag?\" Keer op keer, week na week. Het kost je meer tijd dan de tactische voorbereiding.",
        ],
      },
      {
        heading: "Waarom WhatsApp niet werkt voor teambeheer",
        paragraphs: [
          "WhatsApp is geweldig voor communicatie, maar niet ontworpen voor teamorganisatie. Berichten verdwijnen in de stroom. Er is geen overzicht van wie er kan en wie niet. En als coach heb je geen manier om te zien wie het bericht heeft gelezen maar niet heeft gereageerd.",
          "Bovendien: als je ook opstellingen, scores en statistieken wilt bijhouden, heb je al snel drie apps en een notitieboekje nodig. Dat moet simpeler.",
        ],
      },
      {
        heading: "Alles op één plek",
        paragraphs: [
          "Een teamplanner bundelt alles wat je als coach nodig hebt. Wedstrijden plannen, beschikbaarheid ophalen, opstellingen maken en scores bijhouden — zonder te schakelen tussen apps.",
          "Het grootste voordeel: spelers reageren zelf. Ze openen de app, tikken op \"beschikbaar\" of \"afwezig\", en jij ziet het meteen in een overzicht. Geen berichten meer tellen in WhatsApp.",
        ],
      },
      {
        heading: "Gratis starten",
        paragraphs: [
          "MyTeamPlanner is gratis en speciaal gebouwd voor amateurvoetbal in Nederland. Je maakt in 2 minuten je team aan, stuurt een uitnodigingslink naar je spelers, en je bent klaar.",
          "Werkt op elke telefoon via de browser — geen app store nodig. Probeer het en ontdek hoeveel tijd je bespaart.",
        ],
      },
    ],
  },
  {
    slug: "beschikbaarheid-bijhouden-voetbalteam",
    title: "Beschikbaarheid bijhouden van je voetbalteam: zo doe je dat",
    description:
      "Stop met WhatsApp-berichten tellen. Leer hoe je de beschikbaarheid van je voetbalteam bijhoudt met een simpele tool die automatisch herinneringen stuurt.",
    date: "2026-02-15",
    readingTime: "3 min",
    featureLink: "/features/beschikbaarheid",
    featureLabel: "Beschikbaarheid bijhouden",
    keywords: ["beschikbaarheid voetbalteam", "wie kan er spelen", "beschikbaarheid bijhouden", "teamplanner voetbal"],
    sections: [
      {
        heading: "Het probleem: niemand reageert",
        paragraphs: [
          "Je kent het vast. Het is donderdag, de wedstrijd is zaterdag, en je hebt nog maar 6 reacties van 18 spelers. Je stuurt nog een herinnering, pingt individuele spelers aan, en uiteindelijk weet je vrijdagavond pas of je genoeg spelers hebt.",
          "Dit kost coaches gemiddeld 30-60 minuten per week. Tijd die je beter kunt besteden aan tactiek, training of gewoon aan je gezin.",
        ],
      },
      {
        heading: "Maak het makkelijk om te reageren",
        paragraphs: [
          "De sleutel is: hoe makkelijker het is om te reageren, hoe meer spelers het doen. Met een teamplanner openen spelers de app en tikken ze met één vinger op \"beschikbaar\", \"afwezig\" of \"misschien\". Geen tekst typen, geen scroll door WhatsApp-berichten.",
          "Automatische herinneringen zorgen ervoor dat iedereen op tijd reageert. Geen handmatig nabellen meer.",
        ],
      },
      {
        heading: "Realtime overzicht voor de coach",
        paragraphs: [
          "Als coach zie je in één oogopslag wie er kan spelen. Een groen/rood/oranje grid toont de beschikbaarheid van je hele selectie. Je weet meteen of je genoeg spelers hebt, of dat je een extra bericht moet sturen.",
          "Dit overzicht werkt ook perfect als basis voor je opstelling. Je ziet wie beschikbaar is en sleept ze direct naar het veld.",
        ],
      },
      {
        heading: "Probeer het zelf",
        paragraphs: [
          "Met MyTeamPlanner houd je gratis de beschikbaarheid bij van je hele team. Maak je team aan, nodig je spelers uit met een link, en bij de volgende wedstrijd hoef je niet meer te vragen wie er kan.",
        ],
      },
    ],
  },
  {
    slug: "gratis-voetbal-app-voor-je-team",
    title: "Gratis voetbal app voor je team: alles wat een coach nodig heeft",
    description:
      "Op zoek naar een gratis app voor je amateurvoetbalteam? MyTeamPlanner biedt wedstrijdbeheer, opstellingen, beschikbaarheid en meer — zonder kosten.",
    date: "2026-02-10",
    readingTime: "4 min",
    featureLink: "/register",
    featureLabel: "Gratis starten",
    keywords: ["gratis voetbal app", "voetbal team app", "gratis teamplanner", "app voor voetbalteam"],
    sections: [
      {
        heading: "Wat moet een goede voetbal app kunnen?",
        paragraphs: [
          "Als coach van een amateurteam heb je eigenlijk maar een paar dingen nodig: wedstrijden plannen, weten wie er kan spelen, een opstelling maken, en scores bijhouden. Niet meer, niet minder.",
          "Veel apps proberen alles te zijn: communicatie, video-analyse, GPS-tracking, statistieken. Voor een professioneel team misschien handig, maar voor een 5de klasse zaterdagteam of een JO11 team is het overkill. Je wilt iets simpels dat gewoon werkt.",
        ],
      },
      {
        heading: "Wedstrijden en beschikbaarheid",
        paragraphs: [
          "Maak wedstrijden aan met tegenstander, datum en locatie. Of importeer je hele wedstrijdprogramma direct van je clubwebsite. Spelers geven met één tik hun beschikbaarheid door en jij ziet realtime wie er kan spelen.",
          "De verzameltijd wordt automatisch berekend op basis van de wedstrijdtijd en eventuele reistijd voor uitwedstrijden.",
        ],
      },
      {
        heading: "Opstellingen met drag & drop",
        paragraphs: [
          "Kies een formatie (van 4-3-3 tot 7v7 varianten), sleep je beschikbare spelers naar het veld, en plan wisselmomenten. De app berekent automatisch hoeveel minuten elke speler speelt.",
          "Na de wedstrijd vul je de score in en bouw je seizoensstatistieken op. Wie is topscorer? Wie heeft de meeste wedstrijden gespeeld?",
        ],
      },
      {
        heading: "Werkt op elke telefoon",
        paragraphs: [
          "MyTeamPlanner is een webapp die werkt op elke telefoon, tablet en computer. Geen app store nodig — open de link en je kunt meteen aan de slag. Je kunt het ook als app op je homescreen zetten voor snelle toegang.",
          "Het is volledig gratis. Maak je team aan, deel de uitnodigingslink met je spelers via WhatsApp, en je bent binnen 2 minuten klaar.",
        ],
      },
    ],
  },
  {
    slug: "voetbal-training-oefeningen",
    title: "Voetbal training oefeningen: 79+ kant-en-klare oefeningen",
    description:
      "Geen inspiratie voor de training? Blader door 79+ voetbaloefeningen gefilterd op niveau, thema en spelersaantal. Van warming-up tot tactische sessies.",
    date: "2026-02-05",
    readingTime: "4 min",
    featureLink: "/features/trainingen",
    featureLabel: "Oefeningen bekijken",
    keywords: ["voetbal training oefeningen", "voetbaloefeningen", "training voetbal", "oefeningen jeugdvoetbal"],
    sections: [
      {
        heading: "Het wekelijkse dilemma",
        paragraphs: [
          "Elke coach kent het: het is dinsdagavond, morgen is er training, en je hebt geen idee wat je gaat doen. Je googelt \"voetbal oefeningen\", scrollt door YouTube, en kopieert uiteindelijk een oefening die je vorige maand ook al deed.",
          "Voor seniorenteams is het al lastig, maar voor jeugdteams en G-teams is het nóg moeilijker. De oefeningen moeten passen bij het niveau, het aantal spelers, en het thema dat je wilt trainen.",
        ],
      },
      {
        heading: "Een bibliotheek met 79+ oefeningen",
        paragraphs: [
          "MyTeamPlanner bevat een groeiende bibliotheek met kant-en-klare voetbaloefeningen. Elke oefening heeft een duidelijke beschrijving, materiaallijst, en variaties voor verschillende niveaus.",
          "Filter op categorie (passing, positiespel, verdedigen, aanvallen, conditie), moeilijkheidsgraad (basis, gemiddeld, gevorderd), en teamtype (senioren, jeugd, G-team). Zo vind je in seconden de juiste oefening.",
        ],
      },
      {
        heading: "Van oefening naar trainingsplan",
        paragraphs: [
          "Combineer oefeningen tot een compleet trainingsplan. Kies een warming-up, twee hoofdoefeningen en een partijvorm. De app berekent automatisch de totale duur.",
          "Koppel je trainingsplan aan een trainingsevent in de kalender zodat je spelers van tevoren weten wat er op het programma staat.",
        ],
      },
      {
        heading: "Categorieën",
        paragraphs: [
          "De oefeningen zijn verdeeld over 7 categorieën: warming-up, passing, positiespel, verdedigen, aanvallen, conditie en afwerken. Elke categorie bevat oefeningen van basis tot gevorderd niveau.",
          "Of je nu een eenvoudige rondo zoekt voor de warming-up of een complexe aanvalspatronenoefening — je vindt het in de bibliotheek.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
