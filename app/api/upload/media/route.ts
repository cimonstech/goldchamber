/**
 * Upload media (images) — uses R2 when configured, otherwise Supabase Storage.
 * Admin only.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { uploadToR2, generateFileKey, isR2Configured } from "@/lib/r2";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const SUPABASE_BUCKET = "media";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || user.email === "admin@chamberofgoldbuyers.com";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Invalid type. Allowed: ${ALLOWED_TYPES.join(", ")}` }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const key = `images/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext ? `.${ext}` : ""}`;

  // Prefer R2 when configured
  if (isR2Configured()) {
    const r2Key = generateFileKey("media/images", file.name);
    const url = await uploadToR2({
      key: r2Key,
      body: buffer,
      contentType: file.type,
      metadata: { originalName: file.name },
    });
    if (url) {
      return NextResponse.json({ url, key: r2Key });
    }
  }

  // Fallback: Supabase Storage (run migrations/005_storage_bucket_media.sql to create bucket)
  const { data: uploadData, error } = await supabaseAdmin.storage
    .from(SUPABASE_BUCKET)
    .upload(key, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    const hint =
      error.message?.includes("Bucket not found") || error.message?.includes("not found")
        ? "Create the 'media' bucket: run migrations/005_storage_bucket_media.sql in Supabase SQL editor."
        : "Ensure a 'media' bucket exists in Supabase Storage (Dashboard → Storage), or configure R2 (see env.example.r2).";
    return NextResponse.json({ error: `Upload failed. ${hint}` }, { status: 503 });
  }

  const { data: urlData } = supabaseAdmin.storage.from(SUPABASE_BUCKET).getPublicUrl(uploadData.path);
  return NextResponse.json({ url: urlData.publicUrl, key: uploadData.path });
}
