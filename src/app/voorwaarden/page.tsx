import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Algemene Voorwaarden - MyTeamPlanner",
};

export default function VoorwaardenPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Algemene Voorwaarden</h1>
      <p className="mb-2 text-sm text-muted-foreground">Laatst bijgewerkt: 25 februari 2026</p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Dienst</h2>
          <p>
            MyTeamPlanner is een gratis webapplicatie voor het beheren van amateurvoetbalteams.
            De dienst wordt aangeboden &ldquo;as is&rdquo; zonder garanties op beschikbaarheid of
            foutloze werking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Account</h2>
          <p>
            Om MyTeamPlanner te gebruiken maak je een account aan met je naam, e-mailadres en
            een wachtwoord. Je bent zelf verantwoordelijk voor het geheimhouden van je
            inloggegevens. Je mag per persoon maximaal één account aanmaken.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Gebruik</h2>
          <p>
            Je gebruikt MyTeamPlanner alleen voor het beheren van je (amateur)voetbalteam. Het is
            niet toegestaan om de dienst te gebruiken voor onrechtmatige doeleinden, spam, of het
            verwerken van persoonsgegevens van derden zonder hun toestemming.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Gegevens van teamleden</h2>
          <p>
            Als coach voer je namen en andere gegevens in van je teamleden. Je bent er
            verantwoordelijk voor dat je teamleden weten dat hun gegevens in MyTeamPlanner
            worden opgeslagen. Wanneer een speler zelf een account aanmaakt en je team joint,
            geeft die persoon zelf toestemming.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Beschikbaarheid</h2>
          <p>
            We doen ons best om MyTeamPlanner beschikbaar te houden, maar kunnen geen 100%
            uptime garanderen. We behouden het recht om de dienst tijdelijk of permanent te
            stoppen, met een redelijke opzegtermijn.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Aansprakelijkheid</h2>
          <p>
            MyTeamPlanner is een gratis dienst. Wij zijn niet aansprakelijk voor directe of
            indirecte schade die voortvloeit uit het gebruik van de applicatie, waaronder het
            verlies van gegevens.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Wijzigingen</h2>
          <p>
            We kunnen deze voorwaarden aanpassen. Bij wezenlijke wijzigingen informeren we je
            via de app of per e-mail. Doorgebruik na wijziging ga je akkoord met de nieuwe
            voorwaarden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Contact</h2>
          <p>
            Vragen over deze voorwaarden? Neem contact op via het e-mailadres dat in de app
            vermeld staat.
          </p>
        </section>
      </div>
    </main>
  );
}
