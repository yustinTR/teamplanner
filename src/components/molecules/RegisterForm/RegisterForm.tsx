"use client";

import { useState } from "react";
import Link from "next/link";
import { register } from "@/app/(auth)/actions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  next?: string;
}

export function RegisterForm({ next }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
    }
    if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  const loginHref = next
    ? `/login?next=${encodeURIComponent(next)}`
    : "/login";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Registreren</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Maak een gratis account aan
        </p>
      </div>

      <form action={handleRegister} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

        <div className="space-y-2">
          <Label htmlFor="name">Naam</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Je volledige naam"
            required
            autoComplete="name"
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Wachtwoord</Label>
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
        {success && (
          <div className="rounded-lg bg-success-50 p-3 text-sm text-success">
            {success}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Bezig..." : "Account aanmaken"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Al een account?{" "}
        <Link href={loginHref} className="font-medium text-primary hover:underline">
          Inloggen
        </Link>
      </p>
    </div>
  );
}
