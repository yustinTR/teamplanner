"use client";

import { useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/actions";

export default function ProfilePage() {
  const { user, currentTeam, currentPlayer, isCoach } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(
    user?.user_metadata?.name ?? ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSaveName() {
    setSaving(true);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { name },
    });

    // Also update player record name
    if (currentPlayer) {
      await supabase
        .from("players")
        .update({ name })
        .eq("id", currentPlayer.id);
    }

    setSaving(false);
    setEditing(false);
  }

  return (
    <div>
      {/* Profile header */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 px-4 pb-12 pt-6 text-white">
        <h1 className="text-2xl font-bold">Profiel</h1>
      </div>

      <div className="-mt-8 px-4 pb-4">
        {/* Profile card */}
        <div className="rounded-xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-4">
            <Avatar
              fallback={user?.user_metadata?.name ?? user?.email ?? "?"}
              size="lg"
            />
            <div>
              <h2 className="font-semibold text-neutral-900">
                {user?.user_metadata?.name ?? "Geen naam"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {currentTeam && (
                <p className="mt-0.5 text-xs font-medium text-primary-600">
                  {isCoach ? "Coach" : "Speler"} — {currentTeam.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-4 space-y-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            {editing ? (
              <div className="space-y-3">
                <Label htmlFor="name">Naam</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveName} disabled={saving}>
                    {saving ? "Opslaan..." : "Opslaan"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Annuleren
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Naam</p>
                    <p className="font-medium text-neutral-900">
                      {user?.user_metadata?.name ?? "Niet ingesteld"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-xs font-medium text-muted-foreground">E-mail</p>
                  <p className="font-medium text-neutral-900">{user?.email}</p>
                </div>
              </>
            )}
          </div>

          <form action={logout}>
            <Button variant="outline" className="w-full gap-2 text-danger hover:bg-danger-50 hover:text-danger" type="submit">
              <LogOut className="size-4" />
              Uitloggen
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
