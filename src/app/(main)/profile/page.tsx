"use client";

import { useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card, CardContent } from "@/components/atoms/Card";
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
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-semibold">Profiel</h1>

      <div className="flex items-center gap-4 mb-6">
        <Avatar
          fallback={user?.user_metadata?.name ?? user?.email ?? "?"}
          size="lg"
        />
        <div>
          <h2 className="font-semibold">
            {user?.user_metadata?.name ?? "Geen naam"}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            {editing ? (
              <div className="space-y-2">
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Naam</p>
                  <p className="font-medium">
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
            )}

            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            {currentTeam && (
              <div>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="font-medium">{currentTeam.name}</p>
                <p className="text-sm text-muted-foreground">
                  {isCoach ? "Coach" : "Speler"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <form action={logout}>
          <Button variant="outline" className="w-full" type="submit">
            <LogOut className="mr-2 size-4" />
            Uitloggen
          </Button>
        </form>
      </div>
    </div>
  );
}
