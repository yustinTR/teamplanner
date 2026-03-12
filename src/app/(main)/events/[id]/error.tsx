"use client";

import { Button } from "@/components/atoms/Button";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function EventDetailError({ reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 py-20 text-center">
      <AlertTriangle className="mb-4 size-12 text-danger" />
      <h1 className="text-xl font-semibold">Event kon niet geladen worden</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Er is een fout opgetreden bij het laden van dit event.
      </p>
      <Button className="mt-4" onClick={reset}>
        Opnieuw proberen
      </Button>
    </div>
  );
}
