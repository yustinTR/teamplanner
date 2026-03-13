export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  featureLink: string;
  featureLabel: string;
  keywords: string[];
  relatedSlugs?: string[];
  sections: BlogSection[];
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "opstelling-7-tegen-7-voetbal",
    title: "Opstelling 7 tegen 7: formaties en tips",
    description:
      "Welke formaties werken het beste bij 7 tegen 7? Van 2-3-1 tot 3-2-1 — ontdek de beste opstellingen voor jeugdvoetbal met praktische tips voor coaches.",
    date: "2026-02-28",
    readingTime: "5 min",
    featureLink: "/features/opstellingen",
    featureLabel: "Opstellingen maken",
    keywords: ["opstelling 7 tegen 7", "formatie 7v7", "jeugdvoetbal opstelling", "7 tegen 7 formaties"],
    relatedSlugs: ["wisselschema-jeugdvoetbal", "voetbal-training-oefeningen", "voetbal-teamindeling-maken"],
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
    title: "Wisselschema jeugdvoetbal: eerlijk wisselen",
    description:
      "Hoe maak je een eerlijk wisselschema voor je jeugdteam? Praktische tips en een stapsgewijze aanpak voor coaches die elke speler evenveel speeltijd willen geven.",
    date: "2026-02-25",
    readingTime: "4 min",
    featureLink: "/features/opstellingen",
    featureLabel: "Wisselschema maken",
    keywords: ["wisselschema jeugdvoetbal", "speeltijd verdelen", "eerlijk wisselen voetbal", "wisselschema maken"],
    relatedSlugs: ["opstelling-7-tegen-7-voetbal", "beschikbaarheid-bijhouden-voetbalteam", "spelers-beoordelen-jeugdtrainer"],
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
    title: "Team managen als voetbaltrainer",
    description:
      "Herkenbaar? Eindeloze WhatsApp-berichten over wie er kan spelen. Ontdek hoe je als amateurvoetbalcoach je team efficiënt beheert met een teamplanner.",
    date: "2026-02-20",
    readingTime: "4 min",
    featureLink: "/features/wedstrijden",
    featureLabel: "Wedstrijden beheren",
    keywords: ["team managen voetbal", "voetbaltrainer app", "team beheren", "coach app voetbal"],
    relatedSlugs: ["beschikbaarheid-bijhouden-voetbalteam", "communicatie-voetbalteam", "gratis-voetbal-app-voor-je-team"],
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
    title: "Beschikbaarheid bijhouden voetbalteam",
    description:
      "Stop met WhatsApp-berichten tellen. Leer hoe je de beschikbaarheid van je voetbalteam bijhoudt met een simpele tool die automatisch herinneringen stuurt.",
    date: "2026-02-15",
    readingTime: "3 min",
    featureLink: "/features/beschikbaarheid",
    featureLabel: "Beschikbaarheid bijhouden",
    keywords: ["beschikbaarheid voetbalteam", "wie kan er spelen", "beschikbaarheid bijhouden", "teamplanner voetbal"],
    relatedSlugs: ["team-managen-als-voetbaltrainer", "communicatie-voetbalteam", "gratis-voetbal-app-voor-je-team"],
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
    title: "Gratis voetbal app voor je team",
    description:
      "Op zoek naar een gratis app voor je amateurvoetbalteam? MyTeamPlanner biedt wedstrijdbeheer, opstellingen, beschikbaarheid en meer — zonder kosten.",
    date: "2026-02-10",
    readingTime: "4 min",
    featureLink: "/register",
    featureLabel: "Gratis starten",
    keywords: ["gratis voetbal app", "voetbal team app", "gratis teamplanner", "app voor voetbalteam"],
    relatedSlugs: ["team-managen-als-voetbaltrainer", "beschikbaarheid-bijhouden-voetbalteam", "app-voetbaltrainer"],
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
    title: "Voetbal training oefeningen: 79+ ideeën",
    description:
      "Geen inspiratie voor de training? Blader door 79+ voetbaloefeningen gefilterd op niveau, thema en spelersaantal. Van warming-up tot tactische sessies.",
    date: "2026-02-05",
    readingTime: "4 min",
    featureLink: "/features/trainingen",
    featureLabel: "Oefeningen bekijken",
    keywords: ["voetbal training oefeningen", "voetbaloefeningen", "training voetbal", "oefeningen jeugdvoetbal"],
    relatedSlugs: ["voetbalseizoen-plannen", "spelers-beoordelen-jeugdtrainer", "opstelling-7-tegen-7-voetbal"],
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
  {
    slug: "voetbal-teamindeling-maken",
    title: "Voetbal teamindeling maken: tips voor trainers",
    description:
      "Hoe maak je als trainer een eerlijke en effectieve teamindeling? Van spelerselectie tot posities — praktische tips voor amateurvoetbalcoaches.",
    date: "2026-03-13",
    readingTime: "4 min",
    featureLink: "/features/opstellingen",
    featureLabel: "Opstellingen maken",
    keywords: ["voetbal teamindeling", "teamindeling maken", "voetbal team samenstellen", "teamindeling voetbal coach"],
    relatedSlugs: ["opstelling-7-tegen-7-voetbal", "wisselschema-jeugdvoetbal", "spelers-beoordelen-jeugdtrainer"],
    sections: [
      {
        heading: "Begin bij je spelers, niet bij de formatie",
        paragraphs: [
          "De meeste coaches beginnen bij een formatie: 4-3-3, 4-4-2, of een variant. Maar een goede teamindeling begint bij je spelers. Wie heb je beschikbaar? Wat zijn hun kwaliteiten? Op welke posities voelen ze zich het sterkst?",
          "Ken eerst je selectie — kijk naar snelheid, techniek, ervaring en fitheid. Pas dan kies je een formatie die bij je spelers past, niet andersom. Een 4-3-3 werkt niet als je maar één echte buitenspeler hebt.",
        ],
      },
      {
        heading: "Houd rekening met balans",
        paragraphs: [
          "Een goede teamindeling is meer dan 11 namen op papier. Mix ervaren en onervaren spelers door het veld. Zet een rustige verdediger naast een die graag mee opkomt. Combineer een creatieve middenvelder met iemand die het vuile werk doet.",
          "Denk ook aan links- en rechtsbenige spelers. Een linkspoot op rechtsbuiten snijdt naar binnen, een rechtspoot houdt de breedte. Beide opties zijn geldig, maar het verandert hoe je team speelt.",
        ],
      },
      {
        heading: "Communiceer je keuzes",
        paragraphs: [
          "Spelers accepteren een teamindeling beter als ze begrijpen waarom. Leg uit waarom iemand op een bepaalde positie staat. 'Jij staat centraal achterin omdat je goed overzicht hebt' motiveert meer dan 'zo heb ik het bedacht'.",
          "Bij jeugdteams is dit extra belangrijk. Laat spelers op verschillende posities spelen zodat ze zich breed ontwikkelen. Leg uit dat ze niet altijd op hun favoriete plek staan, maar dat het goed is voor hun ontwikkeling.",
        ],
      },
      {
        heading: "Gebruik een tool",
        paragraphs: [
          "Met pen en papier een teamindeling maken werkt, maar het is niet handig om te delen of aan te passen. Een digitale tool maakt het makkelijker om posities te schuiven, wissels te plannen en je indeling met het team te delen.",
          "In MyTeamPlanner sleep je spelers naar het veld, kies je een formatie en plan je wissels vooraf. Je ziet direct of je indeling klopt en hoeveel minuten elke speler maakt. Spelers kunnen hun positie bekijken in de app.",
        ],
      },
    ],
  },
  {
    slug: "app-voetbaltrainer",
    title: "Beste apps voor voetbaltrainers in 2026",
    description:
      "Welke apps zijn er voor amateurvoetbaltrainers? Een vergelijking van de beste tools voor teammanagement, opstellingen en beschikbaarheid.",
    date: "2026-03-10",
    readingTime: "5 min",
    featureLink: "/register",
    featureLabel: "Gratis starten",
    keywords: ["app voetbaltrainer", "beste voetbal app", "voetbal coach app", "teammanagement app voetbal"],
    relatedSlugs: ["gratis-voetbal-app-voor-je-team", "team-managen-als-voetbaltrainer", "communicatie-voetbalteam"],
    sections: [
      {
        heading: "Waarom een app als trainer?",
        paragraphs: [
          "Als amateurvoetbaltrainer besteed je elke week tijd aan organisatie: wie kan er spelen, wat is de opstelling, hoe laat verzamelen. WhatsApp-groepen raken onoverzichtelijk, papieren lijstjes raken kwijt, en aan het eind van het seizoen heb je geen idee wie hoeveel heeft gespeeld.",
          "Een speciale app bespaart je uren per week. Spelers geven zelf hun beschikbaarheid door, je maakt opstellingen op je telefoon, en statistieken worden automatisch bijgehouden. De tijd die je bespaart kun je besteden aan wat echt belangrijk is: trainen en coachen.",
        ],
      },
      {
        heading: "Waar moet je op letten?",
        paragraphs: [
          "Niet elke app is geschikt voor amateurvoetbal. Let op deze punten: gebruiksgemak (je spelers moeten het ook snappen), prijs (gratis of betaalbaar), taal (Nederlandse interface is een pre), en of de app mobiel-eerst is ontworpen.",
          "Veel apps zijn gebouwd voor professionele clubs en zitten vol functies die je niet nodig hebt. GPS-tracking, video-analyse, en uitgebreide tactiekborden — leuk, maar overkill voor een zaterdagteam in de 3e klasse.",
        ],
      },
      {
        heading: "Populaire opties vergeleken",
        paragraphs: [
          "TeamSnap en Spond zijn internationale apps met een grote gebruikersbasis. Ze bieden basisfuncties voor beschikbaarheid en communicatie, maar zijn niet specifiek voor voetbal. SoccerLAB is gericht op professionele clubs en heeft een prijskaartje dat past bij betaald voetbal.",
          "MyTeamPlanner is specifiek gebouwd voor amateurvoetbal in Nederland. Het is volledig gratis, heeft een Nederlandse interface, en biedt precies wat je nodig hebt: wedstrijden plannen, beschikbaarheid ophalen, opstellingen maken met drag & drop, en seizoensstatistieken bijhouden.",
        ],
      },
      {
        heading: "Conclusie",
        paragraphs: [
          "Voor amateurvoetbalcoaches in Nederland is een simpele, gratis tool het beste. Je hebt geen enterprise-software nodig — je hebt iets nodig dat werkt op de telefoon van elke speler, zonder uitleg.",
          "Probeer MyTeamPlanner en ontdek wat het verschil maakt. In 2 minuten je team aangemaakt, uitnodigingslink delen via WhatsApp, en je bent klaar. Geen app store, geen kosten, geen gedoe.",
        ],
      },
    ],
  },
  {
    slug: "voetbalseizoen-plannen",
    title: "Hoe plan je een voetbalseizoen als trainer",
    description:
      "Een nieuw seizoen begint met goede planning. Van selectie samenstellen tot wedstrijdschema importeren — een stappenplan voor amateurcoaches.",
    date: "2026-03-07",
    readingTime: "5 min",
    featureLink: "/features/wedstrijden",
    featureLabel: "Wedstrijden beheren",
    keywords: ["voetbalseizoen plannen", "seizoen voorbereiden voetbal", "voetbal coach planning", "seizoensplanning amateurvoetbal"],
    relatedSlugs: ["team-managen-als-voetbaltrainer", "voetbal-training-oefeningen", "voetbal-teamindeling-maken"],
    sections: [
      {
        heading: "Begin op tijd",
        paragraphs: [
          "Een goed seizoen begint weken voor de eerste wedstrijd. Inventariseer je selectie: wie blijft, wie vertrekt, en zijn er nieuwe spelers? Zorg dat iedereen geregistreerd staat en dat contactgegevens up-to-date zijn.",
          "Maak een planning voor de voorbereiding. Hoeveel trainingen heb je voor de competitie begint? Welke onderwerpen wil je behandelen? Een simpele weekplanning geeft richting aan je voorbereiding.",
        ],
      },
      {
        heading: "Importeer je wedstrijdprogramma",
        paragraphs: [
          "Veel clubs gebruiken voetbal.nl voor hun competitieschema. In plaats van elke wedstrijd handmatig over te nemen, kun je het hele programma in één keer importeren. Inclusief tegenstanders, datums, tijden en locaties.",
          "Met MyTeamPlanner importeer je je wedstrijdprogramma direct. Wedstrijden verschijnen in je kalender en spelers kunnen meteen hun beschikbaarheid doorgeven. De verzameltijd wordt automatisch berekend, inclusief reistijd voor uitwedstrijden.",
        ],
      },
      {
        heading: "Plan je trainingen",
        paragraphs: [
          "Maak een globaal trainingsplan per periode. Wissel techniek, tactiek en conditie af. In de voorbereiding focus je op conditie en teambuilding. Tijdens de competitie werk je aan specifieke verbeterpunten die je in wedstrijden ziet.",
          "Gebruik een oefeningenbibliotheek voor inspiratie. Met 79+ kant-en-klare oefeningen hoef je niet elke week het wiel opnieuw uit te vinden. Filter op thema, niveau en aantal spelers om snel de juiste oefening te vinden.",
        ],
      },
      {
        heading: "Houd het overzicht",
        paragraphs: [
          "Gedurende het seizoen stapelen wedstrijden, trainingen en evenementen zich op. Een dashboard dat je in één oogopslag laat zien wat er aankomt, wie er beschikbaar is en wat de stand van zaken is, voorkomt dat je iets vergeet.",
          "Kijk regelmatig naar je seizoensstatistieken. Wie maakt de meeste minuten? Is de speeltijdverdeling eerlijk? Moet je de opstelling aanpassen? Data helpt je om betere beslissingen te nemen als coach.",
        ],
      },
    ],
  },
  {
    slug: "voetbal-statistieken-bijhouden",
    title: "Voetbal statistieken bijhouden: zo doe je dat",
    description:
      "Wil je weten wie je topscorer is of hoeveel minuten elke speler maakt? Leer hoe je eenvoudig voetbalstatistieken bijhoudt voor je amateurteam.",
    date: "2026-03-04",
    readingTime: "4 min",
    featureLink: "/features/wedstrijden",
    featureLabel: "Statistieken bijhouden",
    keywords: ["voetbal statistieken bijhouden", "voetbal stats app", "doelpunten bijhouden voetbal", "speeltijd bijhouden"],
    relatedSlugs: ["wisselschema-jeugdvoetbal", "voetbalseizoen-plannen", "app-voetbaltrainer"],
    sections: [
      {
        heading: "Waarom statistieken bijhouden?",
        paragraphs: [
          "Statistieken geven je objectief inzicht in je team. Wie maakt de meeste minuten? Wie scoort het vaakst? Hoe is de speeltijdverdeling? Zonder data ga je af op gevoel, en dat leidt soms tot verkeerde keuzes.",
          "Vooral bij jeugdvoetbal zijn statistieken waardevol. Ze helpen je om eerlijk te verdelen. Als je ziet dat een speler drie wedstrijden op rij minder dan de helft heeft gespeeld, kun je dat compenseren.",
        ],
      },
      {
        heading: "Welke stats zijn nuttig?",
        paragraphs: [
          "Voor amateurvoetbal hoef je niet alles bij te houden. Focus op de basis: doelpunten, assists, gele en rode kaarten, gespeelde wedstrijden en speelminuten. Dat geeft al een compleet beeld van je seizoen.",
          "Wil je verder gaan? Houd dan ook bij wie er in de basis stond en wie invaller was, en op welke positie iemand speelde. Zo kun je aan het eind van het seizoen zien hoe je team zich heeft ontwikkeld.",
        ],
      },
      {
        heading: "Na elke wedstrijd invullen",
        paragraphs: [
          "De sleutel is consistentie. Maak er een gewoonte van om direct na de wedstrijd de score en individuele stats in te vullen. Het kost 2 minuten en voorkomt dat je het vergeet of achteraf moet reconstrueren.",
          "In MyTeamPlanner vul je na de wedstrijd de eindstand in en kun je per speler doelpunten, assists en kaarten noteren. De app berekent automatisch de speelminuten op basis van je geplande wissels.",
        ],
      },
      {
        heading: "Seizoenshighlights",
        paragraphs: [
          "Aan het eind van het seizoen heb je een schat aan data. Wie was topscorer? Wie speelde de meeste wedstrijden? Wie maakte de meeste minuten? Ideaal voor het seizoensoverzicht op de teamavond.",
          "MyTeamPlanner berekent deze highlights automatisch. Je ziet in één overzicht de seizoenstoppers per categorie. Geen Excel nodig, geen handmatig tellen — gewoon invullen na elke wedstrijd en de app doet de rest.",
        ],
      },
    ],
  },
  {
    slug: "communicatie-voetbalteam",
    title: "Communicatie in een voetbalteam verbeteren",
    description:
      "Slechte communicatie kost je spelers en wedstrijden. Ontdek hoe je als coach de communicatie in je amateurvoetbalteam verbetert.",
    date: "2026-03-01",
    readingTime: "4 min",
    featureLink: "/features/beschikbaarheid",
    featureLabel: "Beschikbaarheid bijhouden",
    keywords: ["communicatie voetbalteam", "team communicatie verbeteren", "voetbal team organiseren", "communicatie coach spelers"],
    relatedSlugs: ["team-managen-als-voetbaltrainer", "beschikbaarheid-bijhouden-voetbalteam", "app-voetbaltrainer"],
    sections: [
      {
        heading: "Het probleem met WhatsApp-groepen",
        paragraphs: [
          "Bijna elk amateurteam heeft een WhatsApp-groep. Handig voor een snelle mededeling, maar zodra je er wedstrijdinformatie, beschikbaarheid en opstellingen doorheen gooit, wordt het een chaos. Belangrijke berichten verdwijnen tussen emoji's, memes en discussies over de Eredivisie.",
          "Niet iedereen leest alles. Sommige spelers zetten de groep op mute. En als coach heb je geen idee wie het bericht over de wedstrijd van zaterdag daadwerkelijk heeft gezien. Het resultaat: vrijdagavond nog steeds geen compleet beeld.",
        ],
      },
      {
        heading: "Scheidt informatie van communicatie",
        paragraphs: [
          "De oplossing is simpel: gebruik WhatsApp voor de gezelligheid en een apart kanaal voor de organisatie. Wedstrijdinfo, beschikbaarheid en opstellingen horen niet in een chatgroep. Ze verdienen een plek waar iedereen ze makkelijk terugvindt.",
          "Een teamplanner fungeert als dat aparte kanaal. Spelers openen de app en zien meteen de eerstvolgende wedstrijd, of ze beschikbaar zijn, en wat de opstelling is. Geen scrollen door 200 berichten om te vinden wanneer ze moeten zijn.",
        ],
      },
      {
        heading: "Maak reageren makkelijk",
        paragraphs: [
          "Hoe minder moeite het kost om te reageren, hoe meer spelers het doen. Een WhatsApp-poll is al beter dan een open vraag, maar een app waar je met één tik je beschikbaarheid doorgeeft is het beste.",
          "Automatische herinneringen helpen ook. Als spelers 2 dagen voor de wedstrijd een melding krijgen dat ze nog niet hebben gereageerd, hoeft de coach niet zelf achter iedereen aan te gaan.",
        ],
      },
      {
        heading: "Wees consistent",
        paragraphs: [
          "Het belangrijkste is consistentie. Stuur informatie altijd via hetzelfde kanaal. Als spelers weten waar ze moeten kijken, hoef je niet meer te herhalen. Na een paar weken is het een gewoonte.",
          "Begin klein: gebruik een teamplanner alleen voor beschikbaarheid. Als dat werkt, voeg je opstellingen toe. En voor je het weet gebruik je het voor alles — van wedstrijdplanning tot seizoensstatistieken.",
        ],
      },
    ],
  },
  {
    slug: "spelers-beoordelen-jeugdtrainer",
    title: "Spelers beoordelen en ontwikkelen als jeugdtrainer",
    description:
      "Hoe beoordeel je spelers eerlijk als jeugdtrainer? Praktische tips voor het bijhouden van vaardigheden en het stimuleren van ontwikkeling.",
    date: "2026-02-26",
    readingTime: "5 min",
    featureLink: "/features/opstellingen",
    featureLabel: "Spelerprofielen bekijken",
    keywords: ["spelers beoordelen jeugd", "jeugdvoetbal evaluatie", "spelers ontwikkelen", "vaardigheden jeugdvoetbal"],
    relatedSlugs: ["voetbal-teamindeling-maken", "wisselschema-jeugdvoetbal", "voetbal-training-oefeningen"],
    sections: [
      {
        heading: "Beoordelen is niet hetzelfde als selecteren",
        paragraphs: [
          "Bij jeugdvoetbal gaat het niet om wie de beste is, maar om wie zich het meeste ontwikkelt. Een speler die in september nauwelijks kon passen maar in maart zuivere ballen geeft, verdient erkenning — ook al is hij niet de beste van het team.",
          "Beoordeel spelers op groei, niet alleen op huidig niveau. Dat betekent dat je een startmeting nodig hebt. Noteer aan het begin van het seizoen waar elke speler staat, en vergelijk dat later met hun ontwikkeling.",
        ],
      },
      {
        heading: "Welke vaardigheden beoordeel je?",
        paragraphs: [
          "Houd het simpel. Focus op de basisvaardigheden: techniek, snelheid, passing, positiespel en inzet. Geef elke vaardigheid een score van 1 tot 10. Dat hoeft niet wetenschappelijk exact te zijn — het gaat om het totaalplaatje.",
          "Herhaal de beoordeling een paar keer per seizoen. Na 3 metingen zie je trends: welke spelers groeien snel, wie stagneert, en waar liggen de verbeterpunten van je team als geheel.",
        ],
      },
      {
        heading: "Maak het visueel",
        paragraphs: [
          "Cijfers in een tabel zijn lastig te interpreteren. Een radardiagram per speler maakt sterke punten en verbeterpunten direct zichtbaar. Je ziet in één oogopslag of iemand een allrounder is of juist uitblinkt op één vlak.",
          "In MyTeamPlanner vul je vaardigheden in per speler en zie je automatisch een radardiagram met hun profiel. Vergelijk spelers naast elkaar om te zien hoe ze zich tot het team verhouden.",
        ],
      },
      {
        heading: "Gebruik beoordelingen voor de training",
        paragraphs: [
          "Beoordelingen zijn niet alleen voor het rapport — ze sturen je trainingsplanning. Als je ziet dat 5 spelers laag scoren op passing, plan dan een passtraining. Als het positiespel achterblijft, werk daar een sessie aan.",
          "Zo maak je de koppeling tussen beoordelen en ontwikkelen. Je traint niet willekeurig, maar gericht op wat je team nodig heeft. Dat is het verschil tussen een goede en een geweldige jeugdtrainer.",
        ],
      },
      {
        heading: "Eerlijk en transparant",
        paragraphs: [
          "Bespreek beoordelingen met spelers en bij jeugd ook met ouders. Leg uit wat je ziet en wat ze kunnen verbeteren. Een cijfer zonder context motiveert niemand, maar een uitleg als 'je passing is gegroeid van een 5 naar een 7, geweldig!' geeft vertrouwen.",
          "Wees eerlijk maar positief. Focus op wat goed gaat en benoem verbeterpunten als kansen, niet als tekortkomingen. Jeugdspelers die zich gewaardeerd voelen, ontwikkelen zich sneller.",
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
