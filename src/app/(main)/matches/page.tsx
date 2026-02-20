"use client";

import { MatchList } from "@/components/organisms/MatchList";

export default function MatchesPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <h1 className="text-2xl font-bold text-white">Wedstrijden</h1>
      </div>
      <div className="-mt-2 px-4 pb-4">
        <MatchList />
      </div>
    </div>
  );
}
