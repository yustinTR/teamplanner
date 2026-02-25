import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacybeleid - MyTeamPlanner",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/register"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Privacybeleid</h1>
      <p className="mb-2 text-sm text-muted-foreground">Laatst bijgewerkt: 25 februari 2026</p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Welke gegevens verzamelen we?</h2>
          <p>Bij het aanmaken van een account slaan we de volgende persoonsgegevens op:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Naam</strong> — om je te identificeren binnen je team</li>
            <li><strong>E-mailadres</strong> — voor inloggen en accountgerelateerde e-mails</li>
            <li><strong>Wachtwoord</strong> — versleuteld opgeslagen, nooit in platte tekst</li>
          </ul>
          <p className="mt-2">Daarnaast worden binnen teams de volgende gegevens opgeslagen:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Spelernamen en rugnummers</li>
            <li>Beschikbaarheid per wedstrijd</li>
            <li>Aanwezigheid bij evenementen</li>
            <li>Posities en opstellingen</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Waarvoor gebruiken we je gegevens?</h2>
          <p>We gebruiken je gegevens uitsluitend voor:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Het functioneren van de app (inloggen, teambeheer, beschikbaarheid)</li>
            <li>Accountgerelateerde e-mails (bevestiging, wachtwoord resetten)</li>
          </ul>
          <p className="mt-2">
            We sturen <strong>geen</strong> marketing-e-mails en verkopen je gegevens
            <strong> nooit</strong> aan derden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Hoe slaan we je gegevens op?</h2>
          <p>
            Je gegevens worden opgeslagen bij <strong>Supabase</strong> (database en
            authenticatie) met servers in de EU. Wachtwoorden worden versleuteld
            opgeslagen via industriestandaard hashing. De verbinding met de app is
            altijd versleuteld via HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Wie heeft toegang tot je gegevens?</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Teamcoach</strong> — ziet namen, beschikbaarheid en aanwezigheid van
              teamleden
            </li>
            <li>
              <strong>Teamleden</strong> — zien elkaars namen en beschikbaarheid
            </li>
            <li>
              <strong>Wij</strong> — hebben technisch toegang tot de database voor beheer
              en ondersteuning, maar bekijken je gegevens alleen als dat noodzakelijk is
            </li>
          </ul>
          <p className="mt-2">
            Je gegevens worden <strong>niet</strong> gedeeld met externe partijen, behalve
            de hostingproviders die noodzakelijk zijn voor het draaien van de dienst
            (Supabase, Vercel).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Hoe lang bewaren we je gegevens?</h2>
          <p>
            Je gegevens worden bewaard zolang je account actief is. Als je je account
            verwijdert, worden je persoonsgegevens binnen 30 dagen verwijderd uit onze
            systemen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Jouw rechten (AVG)</h2>
          <p>Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je recht op:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Inzage</strong> — opvragen welke gegevens we van je hebben</li>
            <li><strong>Rectificatie</strong> — je gegevens laten corrigeren</li>
            <li><strong>Verwijdering</strong> — je account en gegevens laten verwijderen</li>
            <li><strong>Dataportabiliteit</strong> — je gegevens in een gangbaar formaat ontvangen</li>
            <li><strong>Bezwaar</strong> — bezwaar maken tegen de verwerking van je gegevens</li>
          </ul>
          <p className="mt-2">
            Neem contact met ons op om van deze rechten gebruik te maken.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Cookies</h2>
          <p>
            MyTeamPlanner gebruikt alleen functionele cookies die noodzakelijk zijn voor het
            inloggen en de werking van de app. We gebruiken <strong>geen</strong> tracking-
            of advertentiecookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Wijzigingen</h2>
          <p>
            We kunnen dit privacybeleid aanpassen. Bij wezenlijke wijzigingen informeren we je
            via de app of per e-mail.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">9. Contact</h2>
          <p>
            Vragen over je privacy of je gegevens? Neem contact op via het e-mailadres dat in
            de app vermeld staat.
          </p>
        </section>
      </div>
    </main>
  );
}
