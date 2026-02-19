"use client";

import { MatchList } from "@/components/organisms/MatchList";

export default function MatchesPage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Wedstrijden</h1>
      <MatchList />
    </div>
  );
}
