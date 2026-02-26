-- Seed: exercise library (~38 exercises across all categories and team types)
-- team_types: senioren, jo19_jo17, jo15_jo13, jo11_jo9, g_team

-- ========== WARMING UP (5) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Rondo 4 tegen 2',
  'Vier spelers spelen de bal rond terwijl twee verdedigers proberen te onderscheppen. Goed als warming-up voor passing en beweging.',
  'warming_up', 'basis',
  '{senioren,jo19_jo17,jo15_jo13}',
  6, 12, 10,
  'Maak een cirkel van ca. 8x8 meter. Vier spelers aan de buitenkant, twee in het midden.',
  'Verklein het veld voor meer druk. Voeg een regel toe: maximaal 2 touches.',
  true
),
(
  'Tikspel met bal',
  'Tikspel waarbij spelers een bal aan de voet moeten houden. Wie getikt wordt zonder bal, wordt tikker.',
  'warming_up', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9,g_team}',
  8, 20, 8,
  'Afgebakend veld van 20x20 meter. Elke speler een bal, 2-3 tikkers zonder bal.',
  'Variatie: tikkers hebben ook een bal en moeten hun bal tegen die van een ander schieten.',
  true
),
(
  'Dynamische stretching loopvormen',
  'Loopvormen met dynamische rekoefeningen: hiehaak, knieheffen, zijwaarts kruispas, uitvalspas.',
  'warming_up', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9,g_team}',
  4, 24, 8,
  'Zet twee rijen pionnen op 20 meter afstand. Spelers lopen heen en weer met verschillende loopvormen.',
  null,
  true
),
(
  'Positiespel 5 tegen 2',
  'Warming-up variant van positiespel. Vijf buitenspelers houden de bal, twee in het midden jagen.',
  'warming_up', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  7, 14, 10,
  'Veld van 10x10 meter. Vijf spelers op de randen, twee in het midden.',
  'Bij 10 keer overspelen wisselen de middenspelers. Of: speel met maximaal 1 touch.',
  true
),
(
  'Kaatsbal estafette',
  'Twee teams racen door de bal te kaatsen en mee te nemen. Combineert warming-up met passing.',
  'warming_up', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  8, 16, 8,
  'Twee rijen pionnen op 15 meter. Teams staan in een rij. Speler kaatst naar de overkant, sprint erachteraan.',
  'Voeg een afwerkoefening toe aan het einde van de sprint.',
  true
);

-- ========== PASSING (8) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Passing in driehoek',
  'Drie spelers passen de bal rond in een driehoek. Focus op balsnelheid, aannemen en lichaamsdraaiing.',
  'passing', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  3, 12, 10,
  'Zet drie pionnen in een driehoek op 10 meter afstand. Groepjes van drie.',
  'Wissel van richting. Voeg een verdediger in het midden toe. Verplicht met links/rechts.',
  true
),
(
  'Dubbele passbeweging',
  'Spelers combineren in tweetallen: pass, loop om de pion, ontvang de return-pass.',
  'passing', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 16, 12,
  'Vier pionnen in een vierkant op 12 meter. Spelers staan bij afwisselende pionnen.',
  'Verhoog het tempo. Voeg een derde man combinatie toe.',
  true
),
(
  'Lange passing oefening',
  'Spelers oefenen lange passes over 25-30 meter. Focus op techniek en gewicht van de pass.',
  'passing', 'gevorderd',
  '{senioren,jo19_jo17}',
  4, 12, 12,
  'Twee groepen staan tegenover elkaar op 25-30 meter. Om en om passen.',
  'Afwisselend met links en rechts. Voeg een aanname-actie toe voor de return-pass.',
  true
),
(
  'Pass en trap onder druk',
  'Speler ontvangt de bal met een tegenstander in de rug en moet in één keer doorspelen of wegdraaien.',
  'passing', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  6, 14, 10,
  'Veld van 15x10 meter. Drie duo''s: aanspeler, ontvanger, verdediger in de rug.',
  'Variatie: ontvanger mag maximaal 2 touches. Of: verplicht wegdraaien voor de pass.',
  true
),
(
  'Passvorm vierkant',
  'Vier groepjes bij vier pionnen in een vierkant. Pass en sluit aan bij de volgende pion. Focus op timing en richting.',
  'passing', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  8, 16, 10,
  'Vierkant van 15x15 meter met pionnen op de hoeken. Groepjes van 3-4 per hoek.',
  'Voeg een dubbele pass toe. Wissel van draairichting. Verplicht links of rechts.',
  true
),
(
  'Kaatsen en diep spelen',
  'Speler speelt kaatsbal en ontvangt de dieptepass. Traint de combinatie van kort-kort-diep.',
  'passing', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  6, 12, 12,
  'Drie spelers in een lijn op 10 en 20 meter. Middenspeler kaatst, buitenspeler speelt diep.',
  'Voeg een afronding toe op doel. Varieer met meer verdedigers.',
  true
),
(
  'Pupillen passspel',
  'Eenvoudig passspel in tweetallen over korte afstand. Focus op binnenkant voet en oogcontact.',
  'passing', 'basis',
  '{jo11_jo9,g_team}',
  4, 16, 10,
  'Tweetallen staan op 5-8 meter afstand. Elke twee een bal.',
  'Afstand vergroten. Afwisselen links en rechts voet.',
  true
),
(
  'Passing met nummers',
  'Spelers krijgen een nummer en moeten in volgorde passen terwijl ze door het veld bewegen.',
  'passing', 'gemiddeld',
  '{jo15_jo13,jo11_jo9,g_team}',
  6, 14, 10,
  'Veld van 20x20 meter. Elk speelernummer. Pass altijd naar het volgende nummer.',
  'Voeg een tweede bal toe. Of verander de volgorde halverwege.',
  true
);

-- ========== POSITIESPEL (6) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Positiespel 4 tegen 4 + 2',
  'Twee teams van 4 met 2 neutrale spelers die altijd meespelen met het team in balbezit.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17}',
  10, 14, 15,
  'Veld van 25x25 meter. Twee teams van 4, 2 neutralen in hesjes. Balbezit houden.',
  'Scoor door de bal via een neutrale speler te laten gaan. Maximaal 2 touches.',
  true
),
(
  'Positiespel 3 tegen 3 + 1',
  'Twee teams van 3 met 1 joker die altijd met balbezit meespeelt. Leert snel schakelen.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  7, 10, 12,
  'Veld van 20x20 meter. Twee teams van 3, 1 joker.',
  'Speeltijd beperken: 3 seconden per bal. Of: scoor door dribbel over de achterlijn.',
  true
),
(
  'Positiespel met doelmannen',
  'Positiespel waarbij gescoord wordt via een doelman aan weerszijden van het veld.',
  'positiespel', 'gevorderd',
  '{senioren,jo19_jo17}',
  10, 16, 15,
  'Veld van 30x20 meter. Twee kleine doeltjes met keepers. Teams van 4 of 5.',
  'Voeg een regel toe: minimaal 5 passes voor je mag scoren.',
  true
),
(
  'Kleurenpositiespel',
  'Drie teams in verschillende kleuren. Twee teams spelen samen tegen het derde team.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  9, 15, 12,
  'Veld van 25x25 meter. Drie teams van 3-5 spelers. Team dat de bal verliest gaat verdedigen.',
  'Beperk touches. Of: team dat scoort blijft in balbezit.',
  true
),
(
  'Positiespel pupillen 3 tegen 1',
  'Drie spelers houden de bal tegen één verdediger. Leer positie kiezen en bal beschermen.',
  'positiespel', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  4, 12, 10,
  'Klein vierkant van 6x6 meter. Drie aan de buitenkant, één in het midden.',
  'Maak het veld kleiner voor meer uitdaging. Of voeg een tweede verdediger toe.',
  true
),
(
  'Overtalsituatie 4 tegen 3',
  'Aanvallend positiespel met overtal. Leer de vrije man vinden en snel combineren.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  7, 14, 12,
  'Halve veld. 4 aanvallers tegen 3 verdedigers + keeper. Aanval moet binnen 15 seconden scoren.',
  'Variatie: na balverlies mogen verdedigers counteren op een minigoal.',
  true
);

-- ========== VERDEDIGEN (5) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  '1 tegen 1 verdedigen',
  'Verdediger staat tegenover aanvaller. Focus op timing, houding en het sturen naar de zijkant.',
  'verdedigen', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  4, 12, 10,
  'Veld van 15x10 meter met twee minigoals. Aanvaller start met de bal, verdediger staat 3 meter ervoor.',
  'Aanvaller krijgt een tijdslimiet van 5 seconden. Of: verdediger start vanuit een achterwaartse sprint.',
  true
),
(
  'Schuiven en dekken',
  'Viermansverdediging oefent met schuiven als blok. Coach stuurt de bal naar verschillende posities.',
  'verdedigen', 'gemiddeld',
  '{senioren,jo19_jo17}',
  8, 14, 15,
  'Halve veld. Vier verdedigers en vier aanvallers. Coach speelt de bal in, verdediging schuift mee.',
  'Voeg een vijfde aanvaller toe. Of werk met een tijdslimiet per aanval.',
  true
),
(
  'Pressing na balverlies',
  'Team verliest de bal en moet binnen 5 seconden druk zetten om de bal terug te winnen.',
  'verdedigen', 'gevorderd',
  '{senioren,jo19_jo17,jo15_jo13}',
  10, 18, 15,
  'Veld van 30x25 meter. Twee teams. Bij balverlies direct omschakelen en pressen.',
  'Tel het aantal seconden tot de bal terug is. Beloon snel balveroveren met een bonuspunt.',
  true
),
(
  'Koppen en wegwerken',
  'Verdedigers oefenen met het wegkoppen van voorzetten. Focus op timing en positie.',
  'verdedigen', 'gemiddeld',
  '{senioren,jo19_jo17}',
  6, 12, 12,
  'Flankspeler geeft voorzetten. 2 verdedigers en 2 aanvallers in het strafschopgebied.',
  'Varieer met hoge en lage voorzetten. Voeg een tweede flankspeler toe.',
  true
),
(
  'Bal afpakken voor pupillen',
  'Eenvoudige 1-tegen-1 oefening waarbij de verdediger leert de bal af te pakken zonder overtreding.',
  'verdedigen', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  4, 12, 10,
  'Klein veld van 10x8 meter. Tweetallen: aanvaller probeert over de lijn te dribbelen.',
  'Wissel na elke poging. Of: verdediger start zittend en moet opstaan.',
  true
);

-- ========== AANVALLEN (5) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Aanval over de flank',
  'Flankspeler ontvangt de bal, dribbelt naar de achterlijn en geeft een voorzet. Spitsen ronden af.',
  'aanvallen', 'gemiddeld',
  '{senioren,jo19_jo17}',
  6, 14, 15,
  'Halve veld met groot doel. Flankspeler start vanaf de middenlijn, 2 spitsen in het strafschopgebied.',
  'Voeg een verdediger toe die druk zet op de flankspeler. Varieer met korte en lange voorzetten.',
  true
),
(
  'Dieptepasses en afronding',
  'Middenvelder speelt een dieptepass op de spits die afrondend op doel. Focus op timing van de loopactie.',
  'aanvallen', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 10, 12,
  'Halve veld. Middenvelder speelt dieptepass vanuit de cirkel. Spits loopt in achter de verdedigingslijn.',
  'Voeg een verdediger toe. Of: spits moet in één keer afronden.',
  true
),
(
  'Combineren in de as',
  'Drie aanvallers combineren door het centrum en ronden af. Train de steekpass, kaatsbal en loopactie.',
  'aanvallen', 'gevorderd',
  '{senioren,jo19_jo17}',
  6, 12, 12,
  'Halve veld. Drie aanvallers starten vanaf 30 meter. Twee verdedigers + keeper.',
  'Varieer het startpunt van de combinatie. Voeg een vierde aanvaller toe.',
  true
),
(
  'Omschakeling naar aanval',
  'Na balverovering snel omschakelen naar een aanval met overtal. Traint snelheid in de omschakeling.',
  'aanvallen', 'gevorderd',
  '{senioren,jo19_jo17,jo15_jo13}',
  10, 18, 15,
  'Veld van 40x30 meter. Twee teams. Na balverovering direct aanvallen op het grote doel.',
  'Beperk de tijd na balverovering tot 8 seconden. Wisselspelers staan klaar om in te vallen.',
  true
),
(
  'Aanvallen voor pupillen: 2 tegen 1',
  'Twee aanvallers tegen één verdediger. Leer samenspelen en de juiste keuze maken: passen of dribbelen.',
  'aanvallen', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  4, 12, 10,
  'Veld van 15x10 meter met een minigoal. Twee aanvallers starten met de bal, één verdediger staat halverwege.',
  'Voeg een keeper toe. Of: verdediger mag pas lopen als de eerste pass is gegeven.',
  true
);

-- ========== CONDITIE (4) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Intervalsprints met bal',
  'Spelers sprinten met de bal over 30 meter, joggen terug, en herhalen. Bouwt conditie op met balgevoel.',
  'conditie', 'gemiddeld',
  '{senioren,jo19_jo17}',
  4, 20, 12,
  'Twee lijnen op 30 meter afstand. Sprint met bal heen, jog zonder bal terug. 8-10 herhalingen.',
  'Voeg een passactie toe aan het einde van elke sprint. Varieer sprintafstand.',
  true
),
(
  'Shuttle runs (heen en terug)',
  'Spelers rennen naar steeds verder gelegen pionnen en terug. Bouwt explosiviteit en uithoudingsvermogen op.',
  'conditie', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 24, 10,
  'Pionnen op 5, 10, 15 en 20 meter. Sprint naar elke pion en terug naar de start. 4-6 sets.',
  'Voeg richtingsveranderingen toe. Of doe het als estafette per team.',
  true
),
(
  'Conditiespel: 3 tegen 3 non-stop',
  'Doorlopend partijspel op een klein veld. Elk team speelt 2 minuten, dan wisselen. Hoge intensiteit.',
  'conditie', 'gevorderd',
  '{senioren,jo19_jo17,jo15_jo13}',
  9, 18, 15,
  'Veld van 20x15 meter met minigoals. Drie teams van 3. Twee teams spelen, derde rust. Rotatie elke 2 minuten.',
  'Verkort de speeltijd voor hogere intensiteit. Of speel 4 tegen 4.',
  true
),
(
  'Conditie estafette voor pupillen',
  'Teamestafette met dribbelen, slalom en sprint. Leuk en uitdagend voor jongere spelers.',
  'conditie', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  8, 20, 10,
  'Slalomparcours van 20 meter met 5 pionnen. Teams in rijen. Dribbel door de slalom, sprint terug, tik de volgende aan.',
  'Voeg een schot op doel toe aan het einde. Of maak het parcours langer.',
  true
);

-- ========== AFWERKEN (5) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Afwerken uit de draai',
  'Spits ontvangt de bal met de rug naar het doel, draait weg en schiet. Traint de eerste aanname en schot.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17}',
  4, 10, 12,
  'Rand strafschopgebied. Aanspeler bij de middencirkel, spits ontvangt en draait.',
  'Voeg een verdediger toe. Varieer: links draaien, rechts draaien, direct schieten.',
  true
),
(
  'Afwerken uit voorzet',
  'Flankspeler geeft voorzetten, aanvallers ronden af met het hoofd of de voet.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17}',
  5, 12, 12,
  'Flankspeler bij de zijlijn op 25 meter. 2-3 spitsen bij de penaltystip en tweede paal.',
  'Varieer met lage en hoge voorzetten. Voeg een verdediger toe in het strafschopgebied.',
  true
),
(
  '1 tegen 1 met keeper',
  'Speler dribbelt op de keeper af en moet scoren. Traint het koelbloedig afmaken.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  3, 12, 10,
  'Start op 25 meter van het doel. Speler dribbelt richting keeper en kiest hoe af te ronden.',
  'Voeg een achtervolgende verdediger toe. Of geef een tijdslimiet.',
  true
),
(
  'Afwerken na combinatie',
  'Korte combinatie van 2-3 passes gevolgd door een schot op doel. Traint passing én afronding.',
  'afwerken', 'gevorderd',
  '{senioren,jo19_jo17,jo15_jo13}',
  5, 12, 12,
  'Start op 30 meter. Speler 1 kaatst naar speler 2, krijgt de bal terug diep en schiet.',
  'Voeg een verdediger toe. Varieer het combinatiepatroon.',
  true
),
(
  'Doeltjesspel voor pupillen',
  'Klein partijspel met minigoals. Iedereen mag scoren, focus op het nemen van kansen.',
  'afwerken', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  6, 14, 12,
  'Veld van 20x15 meter met 4 minigoals (aan elke zijde). Twee teams. Scoor op elk doeltje.',
  'Beperk het aantal touches. Of: doelpunt telt alleen als heel het team over de middenlijn is.',
  true
);
