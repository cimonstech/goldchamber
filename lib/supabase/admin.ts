import { createClient } from "@supabase/supabase-js";

// Public signups are disabled in Supabase dashboard. Accounts are created only via admin approval.

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
