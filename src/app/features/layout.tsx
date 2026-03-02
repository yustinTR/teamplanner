import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/organisms/MarketingFooter";

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Image
              src="/icons/icon-192x192.svg"
              alt="MyTeamPlanner"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold">MyTeamPlanner</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Gratis starten
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {children}

      <MarketingFooter />
    </>
  );
}
