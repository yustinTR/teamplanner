"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/(auth)/actions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    }
    if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900">
          Wachtwoord vergeten
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vul je e-mailadres in en we sturen je een reset-link.
        </p>
      </div>

      <form action={handleReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mailadres</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="je@email.nl"
            required
            autoComplete="email"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-success-50 p-3 text-sm text-success">
            {success}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Bezig..." : "Reset-link versturen"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Terug naar inloggen
        </Link>
      </p>
    </div>
  );
}
