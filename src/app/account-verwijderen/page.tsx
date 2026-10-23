import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SUPPORT_EMAIL = "yustintroost@gmail.com";

export const metadata: Metadata = {
  title: "Account verwijderen",
  description:
    "Zo verwijder je je MyTeamPlanner-account en welke gegevens daarbij worden verwijderd.",
  alternates: {
    canonical: "https://www.myteamplanner.nl/account-verwijderen",
  },
};

export default function DeleteAccountPage() {
  const subject = encodeURIComponent("Verzoek account verwijderen MyTeamPlanner");
  const body = encodeURIComponent(
    "Ik wil mijn MyTeamPlanner-account laten verwijderen.\n\nE-mailadres van mijn account: "
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Je MyTeamPlanner-account verwijderen</h1>
      <p className="mb-2 text-sm text-muted-foreground">Laatst bijgewerkt: 23 oktober 2026</p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-6">
        <section>
          <p>
            Deze pagina geldt voor de MyTeamPlanner-app (Android) en de webversie op
            myteamplanner.nl. Je gebruikt voor beide hetzelfde account; een verwijdering
            geldt dus voor allebei.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Zo dien je een verzoek in</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Stuur een e-mail naar{" "}
              <a href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`}>
                {SUPPORT_EMAIL}
              </a>{" "}
              vanaf het e-mailadres waarmee je bent geregistreerd.
            </li>
            <li>
              Zet in het onderwerp &ldquo;Account verwijderen&rdquo; en vermeld het e-mailadres
              van je account.
            </li>
            <li>
              Je krijgt binnen 5 werkdagen een bevestiging. Het account wordt daarna binnen
              30 dagen verwijderd.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Wat wordt verwijderd</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Je account (naam, e-mailadres en wachtwoord)</li>
            <li>Je koppeling aan teams en je beschikbaarheid en aanwezigheid</li>
            <li>Je pushmeldingen-registraties</li>
            <li>
              Teams die alleen jij beheert, inclusief spelers, wedstrijden, opstellingen,
              evenementen en trainingsplannen van dat team
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Wat bewaard blijft</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Teamgegevens van teams die door een andere coach worden beheerd. Jouw naam wordt
              daarin losgekoppeld van je account; de coach kan je spelersprofiel zelf
              verwijderen.
            </li>
            <li>
              Back-ups van onze hostingprovider worden na maximaal 30 dagen automatisch
              overschreven.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Alleen bepaalde gegevens verwijderen</h2>
          <p>
            Wil je je account houden, maar bijvoorbeeld wel uit een team stappen of een foto
            laten verwijderen? Vraag dat aan je coach, of mail ons via hetzelfde adres.
          </p>
        </section>

        <section>
          <p>
            Meer over hoe we met je gegevens omgaan lees je in ons{" "}
            <Link href="/privacy">privacybeleid</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
