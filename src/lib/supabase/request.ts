import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { createClient } from "./server";
import type { Database } from "./types";

export interface AuthenticatedRequest {
  supabase: SupabaseClient<Database>;
  user: User;
}

/**
 * Resolve the caller of an API route. The web app sends its session as
 * cookies; the Android app sends `Authorization: Bearer <access token>`.
 * Either way the returned client runs as that user, so RLS applies.
 */
export async function authenticateRequest(
  request: Request
): Promise<AuthenticatedRequest | null> {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const token = header.slice("Bearer ".length).trim();
    if (!token) return null;
    const supabase = createSupabaseClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      }
    );
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return { supabase, user: data.user };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, user: data.user };
}
