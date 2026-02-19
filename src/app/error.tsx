"use client";

import { Button } from "@/components/atoms/Button";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <AlertTriangle className="mb-4 size-12 text-danger" />
      <h1 className="text-xl font-semibold">Er is iets misgegaan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Er is een onverwachte fout opgetreden. Probeer het opnieuw.
      </p>
      <Button className="mt-4" onClick={reset}>
        Opnieuw proberen
      </Button>
    </div>
  );
}
