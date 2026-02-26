"use client";

import Image from "next/image";
import { useState } from "react";
import { updatePassword } from "@/app/(auth)/actions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await updatePassword(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Football pitch pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="mb-8 text-center">
          <Image
            src="/icons/icon-192x192.svg"
            alt="MyTeamPlanner logo"
            width={64}
            height={64}
            priority
            className="mx-auto mb-3 rounded-2xl"
          />
          <h1 className="text-2xl font-bold text-white">MyTeamPlanner</h1>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-neutral-900">
                Nieuw wachtwoord
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kies een nieuw wachtwoord voor je account.
              </p>
            </div>

            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nieuw wachtwoord</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimaal 6 tekens"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Bezig..." : "Wachtwoord opslaan"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
