"use client";

import { useUpdateTeam } from "@/hooks/use-team";
import { useAuthStore } from "@/stores/auth-store";
import { trackEvent } from "@/lib/gtm";

/**
 * Switches the current team's parents' follow link on (fresh token) or off
 * (token cleared, old links stop working). `source` says where the coach
 * did it, for GTM.
 */
export function useFollowLink() {
  const updateTeam = useUpdateTeam();

  async function setEnabled(enabled: boolean, source: string) {
    const team = useAuthStore.getState().currentTeam;
    if (!team) return;
    const share_token = enabled ? crypto.randomUUID().replace(/-/g, "") : null;
    await updateTeam.mutateAsync({ id: team.id, share_token });
    useAuthStore.getState().setCurrentTeam({ ...team, share_token });
    if (enabled) trackEvent("enable_follow_link", { source });
  }

  return { setEnabled, isPending: updateTeam.isPending };
}
