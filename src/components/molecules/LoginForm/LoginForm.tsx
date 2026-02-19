"use client";

import { useState } from "react";
import Link from "next/link";
import { loginWithPassword, loginWithMagicLink } from "@/app/(auth)/actions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const result = await loginWithPassword(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleMagicLink(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const result = await loginWithMagicLink(formData);
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
        <h1 className="text-2xl font-semibold">Inloggen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in bij je team
        </p>
      </div>

      <form action={handleLogin} className="space-y-4">
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
            placeholder="Je wachtwoord"
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
        {success && (
          <p className="text-sm text-success">{success}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Bezig..." : "Inloggen"}
        </Button>
      </form>

      <form action={handleMagicLink}>
        <input type="hidden" name="email" id="magic-email" />
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={loading}
          onClick={(e) => {
            const emailInput = document.getElementById("email") as HTMLInputElement;
            const hiddenInput = document.getElementById("magic-email") as HTMLInputElement;
            if (emailInput && hiddenInput) {
              hiddenInput.value = emailInput.value;
            }
            if (!emailInput?.value) {
              e.preventDefault();
              setError("Vul eerst je e-mailadres in.");
            }
          }}
        >
          Stuur magic link
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Nog geen account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Registreren
        </Link>
      </p>
    </div>
  );
}
