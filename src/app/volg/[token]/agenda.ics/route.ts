import { createClient } from "@/lib/supabase/server";
import { buildTeamCalendar } from "@/lib/team-calendar";
import type { PublicTeamView } from "@/types/public-team";

const SITE_URL = "https://www.myteamplanner.nl";

/** Calendar subscription for the follow link; stops working when the coach turns the link off. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_team_view", { share_token_input: token });
  const view = (data as unknown as PublicTeamView) ?? { found: false };

  if (!view.found) {
    return new Response("Deze agenda is niet meer beschikbaar.", { status: 404 });
  }

  const body = buildTeamCalendar(view, { followUrl: `${SITE_URL}/volg/${token}`, now: new Date() });
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="wedstrijden.ics"',
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
