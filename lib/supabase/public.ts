import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for public data (no cookies).
 * Use when cookies() is not available, e.g. generateStaticParams, build time.
 */
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
