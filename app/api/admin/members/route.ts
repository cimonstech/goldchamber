/**
 * Admin members API — uses service role to bypass RLS when profile.role is stale.
 * Only allows access for admin@chamberofgoldbuyers.com or profile.role === 'admin'.
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
  const exportCsv = searchParams.get("export") === "1";

  if (exportCsv) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, membership_number, membership_tier, membership_status, applied_at, created_at")
      .neq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as Record<string, unknown>[];
    const headers = ["Full Name", "Email", "Membership No.", "Tier", "Status", "Applied", "Created"];
    const escapeCsv = (v: string) => (v == null ? "" : `"${String(v).replace(/"/g, '""')}"`);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [
          escapeCsv(r.full_name as string),
          escapeCsv(r.email as string),
          escapeCsv(r.membership_number as string),
          escapeCsv(r.membership_tier as string),
          escapeCsv(r.membership_status as string),
          escapeCsv(r.applied_at as string),
          escapeCsv(r.created_at as string),
        ].join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clgb-members-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const search = searchParams.get("search")?.trim() ?? "";
  const tier = searchParams.get("tier") ?? "All Tiers";
  const status = searchParams.get("status") ?? "All Status";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(50, Math.max(10, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  let q = supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, membership_number, membership_tier, membership_status, applied_at, created_at", { count: "exact" })
    .neq("role", "admin");

  if (search) {
    q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,membership_number.ilike.%${search}%`);
  }
  if (tier !== "All Tiers") q = q.eq("membership_tier", tier);
  if (status !== "All Status") q = q.eq("membership_status", status.toLowerCase());

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await q.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], count: count ?? 0 });
}
