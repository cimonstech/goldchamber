/**
 * Admin documents API — list and create documents (uses service role to bypass RLS)
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 as const };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || user.email === "admin@chamberofgoldbuyers.com";
  if (!isAdmin) return { error: "Forbidden", status: 403 as const };
  return { user };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, title, description, file_url, file_size, category, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { title, description, file_url, file_size, category } = body;
  if (!title || !file_url || !category) {
    return NextResponse.json({ error: "title, file_url, category required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("documents").insert({
    title,
    description: description || null,
    file_url,
    file_size: file_size || null,
    category,
    uploaded_by: auth.user.id,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
