import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public signups are disabled in Supabase dashboard. Accounts are created only via admin approval.
// Lazy init so build succeeds when env vars are not yet available (e.g. Vercel build).

let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
    _admin = createClient(url, key);
  }
  return _admin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getAdmin() as unknown as Record<string, unknown>)[prop as string];
  },
});
