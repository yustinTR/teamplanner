"use client";

import { useState } from "react";
import Link from "next/link";
import { loginWithPassword } from "@/app/(auth)/actions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await loginWithPassword(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  const registerHref = next
    ? `/register?next=${encodeURIComponent(next)}`
    : "/register";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Inloggen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in bij je team
        </p>
      </div>

      <form action={handleLogin} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Wachtwoord</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Vergeten?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Je wachtwoord"
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Bezig..." : "Inloggen"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Nog geen account?{" "}
        <Link href={registerHref} className="font-medium text-primary hover:underline">
          Registreren
        </Link>
      </p>
    </div>
  );
}
