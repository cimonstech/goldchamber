import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for public data (no cookies).
 * Use when cookies() is not available, e.g. generateStaticParams, build time.
 * Returns null when env vars are missing (e.g. during Vercel build).
 */
export function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
