import { Lightbulb, AlertTriangle, ArrowDown, ArrowUp, Target, Users } from "lucide-react";
import { splitMistake, type ExerciseGuide as Guide } from "@/lib/exercise-guides";

interface ExerciseGuideProps {
  guide: Guide;
}

/** Coaching guide under a public exercise: goal, coaching points, mistakes, levels. */
export function ExerciseGuide({ guide }: ExerciseGuideProps) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
          <Target className="size-4" />
          Doel van de oefening
        </h2>
        <p className="text-sm leading-relaxed text-neutral-600">{guide.goal}</p>
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
          <Lightbulb className="size-4" />
          Coachingspunten
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-600">
          {guide.coachingPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
          <AlertTriangle className="size-4" />
          Veelgemaakte fouten
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-neutral-600">
          {guide.mistakes.map((line) => {
            const [mistake, fix] = splitMistake(line);
            return (
              <li key={line}>
                <span className="font-medium text-neutral-800">{mistake}</span>
                {fix && <>: {fix}</>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-neutral-50 p-4">
          <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
            <ArrowDown className="size-4" />
            Makkelijker maken
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600">{guide.easier}</p>
        </div>
        <div className="rounded-xl bg-neutral-50 p-4">
          <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
            <ArrowUp className="size-4" />
            Moeilijker maken
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600">{guide.harder}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
          <Users className="size-4" />
          Tip per leeftijd
        </h2>
        <p className="text-sm leading-relaxed text-neutral-600">{guide.ageTip}</p>
      </section>
    </div>
  );
}
