/**
 * Debug endpoint to verify your profile role.
 * GET /api/debug-profile (while logged in)
 * Returns your profile role so you can confirm admin vs member.
 * Remove or restrict this in production.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, membership_status")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, userId: user.id }, { status: 500 });
  }

  return NextResponse.json({
    email: user.email,
    profile: profile ?? null,
    role: profile?.role ?? "NO_PROFILE",
    message: profile?.role === "admin"
      ? "You should see admin dashboard at /admin/dashboard"
      : "You will see member dashboard. Run migrations/003_fix_admin_role.sql in Supabase to fix.",
  });
}
