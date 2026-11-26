import { faqJsonLd, type FaqItem } from "@/lib/exercise-guides";

interface FaqListProps {
  items: FaqItem[];
  title?: string;
}

/** Compact, always-open FAQ with FAQPage structured data. */
export function FaqList({ items, title = "Veelgestelde vragen" }: FaqListProps) {
  if (!items.length) return null;
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }}
      />
      <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
      <dl className="mt-3 space-y-4">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="text-sm font-semibold text-neutral-800">{item.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-neutral-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
