"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExerciseList } from "@/components/organisms/ExerciseList";

export default function OefeningenPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <Link
          href="/trainingen"
          className="mb-2 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Terug
        </Link>
        <h1 className="text-2xl font-bold text-white">Oefeningen</h1>
      </div>
      <div className="-mt-2 px-4 pb-4">
        <ExerciseList />
      </div>
    </div>
  );
}
