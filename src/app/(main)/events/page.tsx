"use client";

import { EventList } from "@/components/organisms/EventList";

export default function EventsPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <h1 className="text-2xl font-bold text-white">Evenementen</h1>
      </div>
      <div className="-mt-2 px-4 pb-4">
        <EventList />
      </div>
    </div>
  );
}
