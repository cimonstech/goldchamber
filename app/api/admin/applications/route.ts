/**
 * Admin applications API — uses service role to ensure admins always see all applications.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || user.email === "admin@chamberofgoldbuyers.com";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") ?? "pending";
  const countsOnly = searchParams.get("counts") === "1";
  const recentLimit = searchParams.get("recent");
  const recentN = recentLimit ? Math.min(20, Math.max(1, parseInt(recentLimit, 10) || 5)) : 0;

  if (countsOnly) {
    const [p, r, a, rej] = await Promise.all([
      supabaseAdmin.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("applications").select("*", { count: "exact", head: true }).eq("status", "reviewing"),
      supabaseAdmin.from("applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabaseAdmin.from("applications").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    ]);
    return NextResponse.json({
      pending: p.count ?? 0,
      reviewing: r.count ?? 0,
      resolved: (a.count ?? 0) + (rej.count ?? 0),
    });
  }

  let q = supabaseAdmin
    .from("applications")
    .select("id, full_name, email, submitted_at, membership_tier, gold_activity, status", { count: "exact" })
    .order("submitted_at", { ascending: false });

  if (recentN > 0) {
    q = q.limit(recentN);
  } else if (tab === "pending") {
    q = q.eq("status", "pending");
  } else if (tab === "reviewing") {
    q = q.eq("status", "reviewing");
  } else {
    q = q.in("status", ["approved", "rejected"]);
  }

  const { data, count, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], count: count ?? 0 });
}
