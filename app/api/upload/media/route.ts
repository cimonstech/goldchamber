/**
 * Upload media (images) to R2 — for article images, gallery, etc.
 * Admin only.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { uploadToR2, generateFileKey, isR2Configured } from "@/lib/r2";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
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

  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 storage not configured" }, { status: 503 });
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

  const key = generateFileKey("media/images", file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadToR2({
    key,
    body: buffer,
    contentType: file.type,
    metadata: { originalName: file.name },
  });

  if (!url) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({ url, key });
}
