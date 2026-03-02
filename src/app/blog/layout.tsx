import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/organisms/MarketingFooter";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/icon-192x192.svg"
              alt="MyTeamPlanner"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-neutral-900">MyTeamPlanner</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
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
