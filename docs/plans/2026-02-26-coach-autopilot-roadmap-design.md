# TeamPlanner Roadmap — "De Autopilot voor Amateurvoetbalcoaches"

## Visie

TeamPlanner evolueert van organisatie-tool naar **digitale assistent-coach**. De kernbelofte: automatisering die coaches tijd bespaart en slimmer maakt. WhatsApp kan alleen berichten sturen — TeamPlanner denkt mee.

**Doelgroep:** Amateurvoetbalcoaches die overtuigd moeten worden om van WhatsApp over te stappen.
**Groeimodel:** Coach overtuigen → team volgt automatisch.
**Kernwaarde:** Minder herhaalwerk, meer inzicht, betere trainingen.

---

## Fase 1: Trainingsoefeningen-database

### Probleem

Coaches besteden veel tijd aan het bedenken van trainingen. Ze googlen oefeningen, scrollen door YouTube, of doen elke week hetzelfde. Rinus (KNVB) bestaat maar is overweldigend en niet geintegreerd met teammanagement.

### Oplossing

Een eigen bibliotheek van voetbaloefeningen met slimme filters, zodat een coach in 2 minuten een complete training heeft — direct gekoppeld aan de TeamPlanner-kalender.

### Hoe het werkt

1. Coach opent "Trainingen" in de app
2. Kiest filters:
   - **Teamniveau** — automatisch op basis van `team_type` (G-team, JO9-JO11, JO13-JO15, JO17-JO19, Senioren)
   - **Thema** — passing, positiespel, verdedigen, aanvallen, conditie, warming-up, afwerken
   - **Spelersaantal** — 6-8, 9-12, 13-16
   - **Duur** — 15 min, 30 min, 60 min, 75 min
3. Ziet resultaten: kant-en-klare oefeningen met beschrijving, opzet-diagram, variaties
4. Combineert oefeningen tot een **trainingsplan**
5. Koppelt trainingsplan aan een event in de kalender

### Oefening-structuur

Elke oefening bevat:
- Titel en korte beschrijving
- Teamniveau-tags (meerdere mogelijk)
- Thema-tags
- Spelersaantal (min/max)
- Duur in minuten
- Opzet-instructies (stap voor stap)
- Diagram/afbeelding van de opzet
- Variaties (makkelijker/moeilijker)
- Optioneel: video-link (YouTube embed)

### Content-strategie

- **AI-gegenereerd:** Grote initiële set genereren met AI, gestructureerd per niveau en thema
- **Gecureerd:** Aanvullen met bewezen oefeningen van bestaande bronnen (voetbaltrainer.nl, KNVB materiaal, YouTube)
- **Niveauverschillen:** G-elftal oefeningen zijn fundamenteel anders dan senioren — focus op plezier en motoriek vs. tactiek en intensiteit
- **Kwaliteitscontrole:** Alle oefeningen worden gereviewd voordat ze live gaan

### Integratie met bestaande app

- Trainingsplannen koppelen aan events in de kalender
- Teamniveau automatisch bepaald via `team_type`
- Later: koppeling met speler-verbeterpunten (fase 3)

---

## Fase 2: Speler-statistieken

### Probleem

Coaches hebben geen inzicht in wie hoeveel speelt, wie scoort, wie altijd afwezig is. Alles zit in het hoofd van de coach en gaat verloren na het seizoen.

### Oplossing

Statistieken per speler bijhouden: goals, assists, speelminuten, aanwezigheid — met een visueel seizoensoverzicht.

### Hoe het werkt

1. Na een wedstrijd vult de coach snel doelpunten en assists per speler in
2. Speelminuten worden automatisch berekend uit het wisselschema (al gebouwd)
3. Aanwezigheid komt uit de beschikbaarheids-data (al gebouwd)

### Dashboard toont

- **Per speler:** totaal gespeelde minuten, % aanwezigheid, goals, assists, gemiddelde speeltijd per wedstrijd
- **Seizoensoverzicht:** verdeling speelminuten over het team, wie speelt te weinig/te veel
- **Trends:** aanwezigheidspercentage over tijd, speelminuten-verdeling per maand

### Waarom nu (na fase 1)

Statistieken zijn het fundament voor alles wat later komt:
- Slimme opstellingen die rekening houden met eerlijke speelminuten-verdeling
- AI-trainingsplannen die inspelen op teamstatistieken
- Speler-ontwikkeling die progressie kan meten

---

## Fase 3: Speler-ontwikkeling

### Probleem

Coaches zien verbeterpunten bij spelers maar leggen dit nergens vast. Er is geen structurele manier om ontwikkeling bij te houden of te koppelen aan trainingen.

### Oplossing

Per speler sterke en zwakke punten vastleggen, verbeterplannen opstellen, en koppelen aan relevante oefeningen uit de database.

### Hoe het werkt

1. Coach voegt per speler tags/notities toe: "Sterk: snelheid, duels" / "Verbeterpunt: passing onder druk"
2. Verbeterpunten linken automatisch naar relevante oefeningen uit de database
3. Over tijd ontstaat een ontwikkelingsgeschiedenis per speler
4. Coach kan per periode evaluaties schrijven

### Integratie

- Verbeterpunten -> suggesties uit oefeningen-database
- Statistieken -> onderbouwing van evaluaties
- Later: AI combineert alles tot persoonlijke ontwikkelplannen

---

## Fase 4: AI-laag (toekomst, potentieel premium)

### Wat

AI die statistieken + verbeterpunten + oefeningen-database combineert tot gepersonaliseerde suggesties.

### Voorbeelden

- "Jullie team verliest 60% van de duels op het middenveld -> hier zijn 3 oefeningen voor balbezit onder druk"
- Opstelling-suggestie die rekening houdt met eerlijke speelminuten-verdeling over het seizoen
- Proactieve melding: "Speler X heeft 3 wedstrijden niet gespeeld, overweeg hem in de basis"
- Trainingsplan dat automatisch aanpast aan beschikbare spelers en verbeterpunten

### Vereisten

- Fase 1 (oefeningen-database) moet gevuld zijn
- Fase 2 (statistieken) moet voldoende data hebben (minimaal halve seizoen)
- Fase 3 (verbeterpunten) geeft de AI context over wat het team nodig heeft

---

## Monetisatie

Nog niet bepaald — focus nu op gebruikersbasis opbouwen. Architectuur wordt zo gebouwd dat het later makkelijk is om features achter een paywall te zetten. Mogelijke modellen voor later:
- Freemium (basis gratis, AI-features premium)
- Feature-tiering (limiet op teams/spelers)
- Club-licentie (meerdere teams)

---

## Concurrentievoordeel

| WhatsApp | TeamPlanner |
|----------|-------------|
| "Wie kan er zaterdag?" in de groep | Beschikbaarheid in 1 tap |
| Opstelling in je hoofd | Auto-opstelling met wisselschema |
| Geen idee wat je gaat trainen | Trainingsplan in 2 minuten |
| "Hoeveel heeft ie gespeeld?" — geen idee | Speelminuten-dashboard |
| Elk seizoen opnieuw beginnen | Ontwikkeling per speler bijhouden |

De unieke combinatie van **teammanagement + trainingscontent + data-driven inzichten** maakt TeamPlanner onderscheidend van zowel WhatsApp (geen features) als Rinus (geen teammanagement).
