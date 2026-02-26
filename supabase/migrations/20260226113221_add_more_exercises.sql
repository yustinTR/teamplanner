-- Additional exercises: expand library from ~38 to ~80 exercises
-- Adds more variety per category and team type coverage

-- ========== WARMING UP (extra 5 = 10 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Tikkertje met verlosser',
  'Tikspel waarbij getikte spelers bevroren staan. Andere spelers bevrijden hen door een tunnel te vormen of een high-five te geven.',
  'warming_up', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9,g_team}',
  8, 22, 8,
  'Veld van 20x20 meter. Twee tikkers in hesjes. Getikte spelers staan met benen wijd.',
  'Variatie: bevrijden door een bal door de benen te spelen. Of: drie tikkers.',
  true
),
(
  'Reactie-sprint warming-up',
  'Spelers joggen door het veld en reageren op commando''s: sprint, draai, spring, sit-down, versnelling.',
  'warming_up', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  6, 24, 8,
  'Veld van 25x25 meter. Spelers joggen in verschillende richtingen. Coach roept commando''s.',
  'Voeg een bal toe: bij "sprint" dribbelen, bij "draai" de bal beschermen.',
  true
),
(
  'Partijvorm warming-up 4v4',
  'Klein partijspel op laag tempo als warming-up. Focus op balbezit, niet op scoren.',
  'warming_up', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  8, 16, 10,
  'Veld van 20x15 meter. Twee teams van 4. Speel op balbezit, scoren door dribbel over de lijn.',
  'Maximaal 3 touches. Of: scoren door 10 keer overspelen.',
  true
),
(
  'Warming-up met hoepels',
  'Spelers dribbelen door een parcours met hoepels. Goede coördinatie- en balvaardigheid warming-up voor jongere spelers.',
  'warming_up', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  6, 18, 8,
  'Zet hoepels neer in een parcours. Spelers dribbelen erdoorheen met de bal aan de voet.',
  'Voeg een race-element toe: wie is het snelst door het parcours?',
  true
),
(
  'Kopbal-tik',
  'Opwarmvorm waarbij spelers de bal met het hoofd overspelen. Wie de bal laat vallen, doet een opdracht.',
  'warming_up', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 12, 8,
  'Groepjes van 4-6 in een kring. Gooi de bal omhoog en kop naar de volgende speler.',
  'Kop de bal met richting: alleen naar links of rechts om de kring.',
  true
);

-- ========== PASSING (extra 7 = 15 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Y-passing',
  'Drie posities in een Y-vorm. Spelers passen en lopen naar de volgende positie. Traint passing en positiewisseling.',
  'passing', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  6, 15, 12,
  'Drie kegels in een Y-vorm op 12-15 meter afstand. Groepjes van 2-3 per kegel.',
  'Voeg een vierde kegel toe voor een X-vorm. Varieer met links en rechts.',
  true
),
(
  'Muur-pass oefening',
  'Speler speelt tegen de muur (of combinatie met medespeler) en verwerkt de terugkaatsbal. Herhaling voor automatisme.',
  'passing', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  2, 12, 10,
  'Twee spelers op 8 meter. Speler 1 kaatst, speler 2 speelt terug met links/rechts.',
  'Na 10 ballen wisselen. Voeg een draaibeweging toe na de kaatsbal.',
  true
),
(
  'Diagonale passing lijn',
  'Spelers staan in twee diagonale lijnen en passen diagonaal naar de overkant met verplaatsing.',
  'passing', 'gemiddeld',
  '{senioren,jo19_jo17}',
  8, 16, 12,
  'Twee rijen diagonaal op 15 meter. Pass naar de overkant, sluit aan bij de andere rij.',
  'Voeg een controle-actie toe voor de pass. Wissel van diagonaalrichting.',
  true
),
(
  'Passing onder weerstand',
  'Twee teams in een vak. Balbezittend team past rond terwijl het andere team druk zet op de passlijn.',
  'passing', 'gevorderd',
  '{senioren,jo19_jo17}',
  8, 14, 12,
  'Veld van 20x20 meter. Team A (5 spelers) past rond, team B (3 spelers) probeert te onderscheppen.',
  'Bij onderschepping wisselen de teams. Of: maximaal 2 touches.',
  true
),
(
  'Verplaatsende driehoek',
  'Drie spelers vormen een driehoek die als geheel over het veld beweegt met continue passing.',
  'passing', 'gemiddeld',
  '{jo15_jo13,jo11_jo9,g_team}',
  6, 15, 10,
  'Drie spelers per groep. Start aan de zijlijn, beweeg al passend naar de overkant.',
  'Vergroot de driehoek. Of: voeg een vierde speler toe als ruit.',
  true
),
(
  'Ping-pong passing',
  'Twee spelers snel heen en weer passen over korte afstand. Ontwikkelt snelheid van handelen en balcontrole.',
  'passing', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9,g_team}',
  2, 20, 8,
  'Tweetallen op 5 meter afstand. Zo snel mogelijk heen en weer passen gedurende 30 seconden.',
  'Verplaats na elke 10 ballen. Links voet, rechts voet afwisselen.',
  true
),
(
  'Cross-passing veld',
  'Vier groepen op de hoeken van een vierkant spelen tegelijkertijd diagonaal en recht door zonder botsing.',
  'passing', 'gevorderd',
  '{senioren,jo19_jo17,jo15_jo13}',
  8, 16, 12,
  'Vierkant van 20x20 meter. Vier groepen van 3-4. Twee ballen: één gaat diagonaal, één gaat recht.',
  'Drie ballen voor extra chaos. Communicatie is essentieel.',
  true
);

-- ========== POSITIESPEL (extra 6 = 12 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Positiespel met 4 doeltjes',
  'Teams proberen te scoren op een van de vier minigoals. Stimuleert snel schakelen en overzicht.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  8, 16, 15,
  'Veld van 25x25 meter met 4 minigoals op elke zijde. Twee teams van 4-5.',
  'Na een doelpunt meteen aanvallen op het tegenoverliggende doel.',
  true
),
(
  'Positiespel 5v5 met zones',
  'Twee teams spelen in drie zones (verdediging, middenveld, aanval). Per zone maximum aantal spelers.',
  'positiespel', 'gevorderd',
  '{senioren,jo19_jo17}',
  10, 16, 15,
  'Veld van 40x25 meter in drie zones verdeeld. Maximaal 2 spelers per zone per team.',
  'Bij balbezit mag één extra speler de zone in. Scoor alleen vanuit de aanvalszone.',
  true
),
(
  'Rondo 6 tegen 3',
  'Zes buitenspelers houden de bal tegen drie verdedigers in het midden. Hoger tempo dan 4v2.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  9, 15, 12,
  'Cirkel van 12x12 meter. Zes aan de buitenkant, drie in het midden.',
  'Maximaal 1 touch. Bij 15 keer overspelen wisselen de middenspelers.',
  true
),
(
  'Positiespel met aanvalslijn',
  'Balbezittend team scoort door de bal via een pass over de aanvalslijn te spelen. Traint diepte zoeken.',
  'positiespel', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  8, 14, 12,
  'Veld van 30x20 meter. Twee teams. Scoor door de bal gecontroleerd aan te nemen achter de eindlijn.',
  'Voeg een doelman toe achter de lijn. Of: alleen scoren na minimaal 4 passes.',
  true
),
(
  'Bezit houden pupillen 4v2',
  'Versimpelde positiespelvorm voor jonge spelers. Vier tegen twee in een klein veld.',
  'positiespel', 'basis',
  '{jo11_jo9,g_team}',
  6, 12, 10,
  'Klein vierkant van 8x8 meter. Vier buitenspelers, twee in het midden. Wissel bij onderschepping.',
  'Vergroot het veld bij succes. Of: alleen met de binnenkant van de voet passen.',
  true
),
(
  'Positiespel met vaste punten',
  'Spelers op vaste posities aan de rand van het veld, 2-3 vrije spelers in het midden combineren.',
  'positiespel', 'gevorderd',
  '{senioren,jo19_jo17}',
  10, 16, 15,
  'Veld van 30x20 meter. 4 vaste spelers op de randen, 3v3 in het midden. Randspelers spelen altijd mee met balbezit.',
  'Randspelers mogen ook naar binnen komen. Of: maximaal 1 touch voor randspelers.',
  true
);

-- ========== VERDEDIGEN (extra 5 = 10 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  '2 tegen 2 verdedigen',
  'Twee verdedigers werken samen tegen twee aanvallers. Traint communicatie, dekken en het juiste moment om druk te zetten.',
  'verdedigen', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 12, 12,
  'Veld van 20x15 meter met een minigoal. Twee aanvallers starten met de bal, twee verdedigers staan halverwege.',
  'Voeg een keeper toe. Of: verdedigers mogen pas bewegen als eerste pass is gegeven.',
  true
),
(
  'Onderscheppen in de passlijn',
  'Verdediger leert de passlijn te lezen en de bal te onderscheppen. Reactiesnelheid en positie.',
  'verdedigen', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  6, 12, 10,
  'Drie aanvallers passen rond, één verdediger probeert te onderscheppen. Wissel bij succes.',
  'Twee verdedigers tegelijk. Of: aanvallers mogen maximaal 2 touches.',
  true
),
(
  'Terugverdedigen na balverlies',
  'Speler verliest de bal en moet direct terug sprinten om de aanval te stoppen. Omschakelconditie.',
  'verdedigen', 'gevorderd',
  '{senioren,jo19_jo17}',
  6, 16, 12,
  'Halve veld. Aanvaller vertrekt als de bal wordt weggespeeld. Verdediger moet terug sprinten en bijhalen.',
  'Twee verdedigers, drie aanvallers voor meer druk. Beperk de tijd.',
  true
),
(
  'Verdedigend kopwerk',
  'Verdedigers oefenen het wegkoppen van hoge ballen in een drukke situatie. Focus op timing en kracht.',
  'verdedigen', 'gemiddeld',
  '{senioren,jo19_jo17}',
  6, 12, 12,
  'Strafschopgebied. Coach of speler gooit hoge ballen. 2 verdedigers en 2 aanvallers dueleren.',
  'Varieer met voorzetten vanuit de flank. Verdediger moet naar een zone wegkoppen.',
  true
),
(
  'Schildpad-verdediging',
  'Drie verdedigers vormen een blok en schuiven als eenheid. Aanvallers proberen erdoorheen te spelen.',
  'verdedigen', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  6, 14, 10,
  'Veld van 20x15 meter. Drie verdedigers op een lijn, drie aanvallers proberen te scoren op een minigoal.',
  'Leer de kinderen: samen schuiven, niet alleen rennen. Coach stuurt bij.',
  true
);

-- ========== AANVALLEN (extra 5 = 10 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Overlap en voorzet',
  'Buitenspeler speelt in op de middenvelder die overloopt en een voorzet geeft. Traint de overlap.',
  'aanvallen', 'gemiddeld',
  '{senioren,jo19_jo17}',
  6, 14, 12,
  'Halve veld. Buitenspeler start vanaf de zijlijn, middenvelder vanuit het centrum. 2 spitsen in het strafschopgebied.',
  'Voeg een verdediger toe die de overlap probeert te stoppen.',
  true
),
(
  '3 tegen 2 counter',
  'Drie aanvallers counteren tegen twee verdedigers. Traint snelle beslissingen in overtalssituatie.',
  'aanvallen', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  5, 14, 12,
  'Halve veld. 3 aanvallers starten vanaf de middenlijn, 2 verdedigers + keeper verdedigen.',
  'Beperk de tijd tot 8 seconden. Of: verdediger mag extra speler erbij roepen.',
  true
),
(
  'Kaats-en-ga aanval',
  'Aanvaller speelt kaatsbal en sprint diep. Middenvelder levert de dieptepass. Traint timing van de loopactie.',
  'aanvallen', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 12, 10,
  'Start op 30 meter. Speler 1 kaatst naar speler 2 en sprint diep. Speler 2 levert de dieptepass.',
  'Voeg een verdediger toe. Wissel na 5 herhalingen.',
  true
),
(
  'Dribbelen en passeren',
  'Aanvaller dribbelt naar een verdediger en moet op het juiste moment de medespeler aanspelen.',
  'aanvallen', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  4, 14, 10,
  'Veld van 20x15 meter. Twee aanvallers, één verdediger, minigoal. Aanvaller dribbelt en past op het juiste moment.',
  'Verdediger wordt actiever. Of: aanvaller moet voor de helft van het veld passen.',
  true
),
(
  'Wisselen van speelzijde',
  'Het team speelt de bal van links naar rechts (of andersom) om de verdediging te verschuiven en open ruimte te creëren.',
  'aanvallen', 'gevorderd',
  '{senioren,jo19_jo17}',
  10, 18, 15,
  'Volledig veld. Twee teams. Aanvallend team oefent het wisselen van kant via het middenveld.',
  'Na 3 keer wisselen van kant, mag er gescoord worden. Of: verplicht via de backs.',
  true
);

-- ========== CONDITIE (extra 6 = 10 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Ladder oefening (speed ladder)',
  'Spelers rennen door een speedladder met verschillende looppatronen. Verbetert voetenwerk en coördinatie.',
  'conditie', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 20, 10,
  'Speedladder op de grond. Spelers lopen door met: twee voeten in elk vak, zijwaarts, hinkelen.',
  'Combineer met een sprint van 10 meter na de ladder. Voeg een bal toe.',
  true
),
(
  'Box-to-box duurloop',
  'Spelers lopen heen en weer over het hele veld op een matig tempo. Bouwt basiscondite op.',
  'conditie', 'basis',
  '{senioren,jo19_jo17}',
  4, 24, 15,
  'Volledig veld. Spelers lopen van strafschopgebied naar strafschopgebied. 8-12 herhalingen.',
  'Verhoog het tempo elke 3 herhalingen. Of: dribbel met bal op de terugweg.',
  true
),
(
  'Cirkeltraining voetbal',
  'Stations met verschillende oefeningen: sprints, squats, planken, balcontrole, koppen. Per station 45 seconden.',
  'conditie', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  8, 20, 20,
  'Zet 6-8 stations neer in een cirkel. Per station 45 seconden werk, 15 seconden rust. 2-3 rondes.',
  'Wissel de stations elke week. Voeg voetbalspecifieke oefeningen toe.',
  true
),
(
  'Sprint-herstel training',
  'Sprint 20 meter, jog 40 meter terug, sprint 20 meter. Bouwt herhaalde sprint-ability op.',
  'conditie', 'gevorderd',
  '{senioren,jo19_jo17}',
  4, 20, 12,
  'Twee lijnen op 20 meter. Sprint heen, jog terug, herhaal. 10-15 herhalingen met 30 sec rust.',
  'Maak het wedstrijdspecifiek: sprint met richtingsverandering.',
  true
),
(
  'Conditiespel: koning van het veld',
  'Drie teams, twee spelen tegen elkaar, verliezer wisselt met het rustende team. Hoge intensiteit.',
  'conditie', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  9, 18, 15,
  'Veld van 25x15 meter met minigoals. Drie teams van 3. Winnaar blijft, verliezer wisselt.',
  'Bij gelijkspel gaan beide teams eruit. Of: speel met een tijdslimiet van 90 seconden.',
  true
),
(
  'Tikspel met conditie-opdrachten',
  'Tikspel waarbij getikte spelers een opdracht moeten doen (10 sit-ups, 5 burpees) voor ze mogen meedoen.',
  'conditie', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  8, 20, 10,
  'Veld van 20x20 meter. 2-3 tikkers. Getikte spelers doen de opdracht aan de zijlijn.',
  'Wissel de opdrachten. Of: maak teams — het team dat het eerst iedereen getikt heeft wint.',
  true
);

-- ========== AFWERKEN (extra 7 = 12 total) ==========

insert into public.exercises (title, description, category, difficulty, team_types, min_players, max_players, duration_minutes, setup_instructions, variations, is_published) values
(
  'Afwerken uit de stuit',
  'Bal wordt opgegooid en uit de stuit volley geschoten. Traint timing en schuinstechniek.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  3, 10, 10,
  'Rand strafschopgebied. Speler gooit de bal op, laat stuiteren en schiet volley.',
  'Beperk tot links voet of rechts voet. Voeg een keeper toe.',
  true
),
(
  'Kopgoal oefening',
  'Flankspeler geeft voorzetten, aanvallers scoren met het hoofd. Traint timing en richting van de kopbal.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17}',
  4, 10, 12,
  'Flankspeler bij de zijlijn, 2-3 koppers bij de penaltystip. Afwisselend vanaf links en rechts.',
  'Varieer de hoogte van de voorzetten. Voeg een verdediger toe die meetkopt.',
  true
),
(
  'Penalty training',
  'Spelers oefenen penalty''s met focus op hoekplaatsing en mentale rust.',
  'afwerken', 'basis',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9,g_team}',
  2, 20, 10,
  'Penaltystip. Keeper in het doel. Spelers schieten om en om. Tel de score.',
  'Onder druk: hele team kijkt toe. Of: penalty-knock-out toernooi.',
  true
),
(
  'Schot van afstand',
  'Spelers schieten vanaf 20-25 meter op doel. Traint schottechniek en schotkracht.',
  'afwerken', 'gevorderd',
  '{senioren,jo19_jo17}',
  4, 12, 12,
  'Twee rijen op 20-25 meter. Om en om schieten. Keeper in het doel.',
  'Varieer: laag schieten, hoog schieten, met effect. Wisselschot links/rechts.',
  true
),
(
  'Afwerken na dribbel',
  'Speler dribbelt door een slalom van kegels en rondt af op doel. Combineert techniek met afronding.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13,jo11_jo9}',
  3, 12, 10,
  'Slalom van 5 kegels op 15 meter van het doel. Speler dribbelt erdoor en schiet.',
  'Verplicht links/rechts voet. Voeg een verdediger toe die achtervolgt.',
  true
),
(
  'Schieten op minigoals',
  'Twee teams schieten op meerdere minigoals. Iedereen scoort, veel schoten op doel. Perfect voor jongere spelers.',
  'afwerken', 'basis',
  '{jo15_jo13,jo11_jo9,g_team}',
  6, 16, 12,
  'Veld van 25x20 meter met 4 minigoals. Twee teams. Scoor op elk doeltje van de tegenstander.',
  'Alleen scoren van dichtbij (binnen 5 meter). Of: scoor alleen met links voet.',
  true
),
(
  'Eén-twee en afronden',
  'Speler speelt een één-twee combinatie met een medespeler en rondt direct af op doel.',
  'afwerken', 'gemiddeld',
  '{senioren,jo19_jo17,jo15_jo13}',
  4, 12, 12,
  'Rand strafschopgebied. Speler 1 speelt in op speler 2, krijgt de bal terug en schiet direct.',
  'Voeg een passieve verdediger toe. Of: combinatie met drie spelers.',
  true
);
