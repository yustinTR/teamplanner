"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
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
        <h2 className="text-xl font-semibold text-neutral-900">Inloggen</h2>
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
          {loading ? "Bezig..." : "Inloggen"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-muted-foreground">of</span>
        </div>
      </div>

      <form action={handleMagicLink}>
        <input type="hidden" name="email" id="magic-email" />
        <Button
          type="submit"
          variant="outline"
          className="w-full gap-2"
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
          <Mail className="size-4" />
          Inloggen via e-mail link
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
