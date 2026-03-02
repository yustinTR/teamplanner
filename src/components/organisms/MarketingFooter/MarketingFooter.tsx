import Image from "next/image";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-neutral-900 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white">
              <Image
                src="/icons/icon-192x192.svg"
                alt="MyTeamPlanner"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="font-semibold">MyTeamPlanner</span>
            </Link>
            <p className="mt-2 text-sm text-neutral-400">
              De gratis teamplanner voor amateurvoetbal in Nederland.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Functies</h3>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-neutral-400">
              <Link href="/features/wedstrijden" className="hover:text-white">Wedstrijden</Link>
              <Link href="/features/beschikbaarheid" className="hover:text-white">Beschikbaarheid</Link>
              <Link href="/features/opstellingen" className="hover:text-white">Opstellingen</Link>
              <Link href="/features/trainingen" className="hover:text-white">Trainingen</Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Links</h3>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-neutral-400">
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/login" className="hover:text-white">Inloggen</Link>
              <Link href="/register" className="hover:text-white">Registreren</Link>
              <Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
