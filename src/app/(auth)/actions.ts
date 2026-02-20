"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginWithPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: "Je e-mail is nog niet bevestigd. Check je inbox." };
    }
    return { error: "Ongeldige inloggegevens. Probeer het opnieuw." };
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Dit e-mailadres is al geregistreerd." };
    }
    return { error: "Registratie mislukt. Probeer het opnieuw." };
  }

  // If email confirmation is required, session will be null
  if (data.user && !data.session) {
    return {
      success:
        "Account aangemaakt! Check je e-mail om je registratie te bevestigen.",
    };
  }

  redirect("/dashboard");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: "Kon geen reset-link versturen. Probeer het opnieuw." };
  }

  return { success: "Check je e-mail voor de reset-link." };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Kon wachtwoord niet wijzigen. Probeer het opnieuw." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
