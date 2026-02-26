"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TrainingPlanDetail } from "@/components/organisms/TrainingPlanDetail";

export default function TrainingPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <Link
          href="/trainingen"
          className="mb-2 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Trainingen
        </Link>
        <h1 className="text-2xl font-bold text-white">Trainingsplan</h1>
      </div>
      <div className="-mt-2 px-4 pb-4">
        <TrainingPlanDetail planId={id} />
      </div>
    </div>
  );
}
