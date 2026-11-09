import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { FaqSection } from "@/components/molecules/FaqSection";

interface LinkItem {
  href: string;
  label: string;
}

interface ToolLandingTemplateProps {
  breadcrumb: string;
  title: string;
  intro: string;
  /** Key facts about the match format, shown as a short list above the tool. */
  facts: string[];
  /** The interactive tool. */
  children: ReactNode;
  /** Explanation below the tool: heading plus paragraphs. */
  sections: { heading: string; paragraphs: string[] }[];
  faq: { question: string; answer: string }[];
  /** Same tool for other formats, and the other tool for this format. */
  related: LinkItem[];
}

/**
 * Layout for a free-tool landing page targeting one search intent
 * ("wisselschema 8 tegen 8"). Structure only; the tool comes in as children.
 */
export function ToolLandingTemplate({
  breadcrumb,
  title,
  intro,
  facts,
  children,
  sections,
  faq,
  related,
}: ToolLandingTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: breadcrumb }]} />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{intro}</p>

          <ul className="mt-6 space-y-1.5 rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-700">
            {facts.map((fact) => (
              <li key={fact} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">{children}</div>

          {sections.map((section) => (
            <section key={section.heading} className="mt-12 space-y-3 text-neutral-700">
              <h2 className="text-xl font-bold text-neutral-900">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {related.length > 0 && (
            <nav aria-label="Andere speelvormen" className="mt-12">
              <h2 className="text-base font-semibold text-neutral-900">Ook handig</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:border-primary-600 hover:text-primary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </main>
      <FaqSection items={faq} />
    </div>
  );
}
