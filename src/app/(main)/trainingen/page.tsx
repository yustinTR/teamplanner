"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingPlanList } from "@/components/organisms/TrainingPlanList";
import { EventList } from "@/components/organisms/EventList";

export default function TrainingenPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <h1 className="text-2xl font-bold text-white">Training</h1>
      </div>
      <div className="-mt-2 px-4 pb-4">
        <Tabs defaultValue="trainingen" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="trainingen" className="flex-1">
              Trainingen
            </TabsTrigger>
            <TabsTrigger value="evenementen" className="flex-1">
              Evenementen
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trainingen">
            <TrainingPlanList />
          </TabsContent>
          <TabsContent value="evenementen">
            <EventList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
