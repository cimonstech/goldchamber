import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Chamber of Gold Buyers <onboarding@resend.dev>";

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text).replace(/[&<>"']/g, (c) => map[c] ?? c);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { data: adminProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { applicationId, reason, reviewNotes } = body;

  if (!applicationId || !reason?.trim()) {
    return NextResponse.json(
      { error: "applicationId and reason are required" },
      { status: 400 }
    );
  }

  const { data: application, error: appError } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const notes = reviewNotes
    ? `${reviewNotes}\n\nRejection reason: ${reason}`
    : `Rejection reason: ${reason}`;

  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({
      status: "rejected",
      reviewed_at: now,
      review_notes: notes,
      reviewed_by: session.user.id,
    })
    .eq("id", applicationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Send rejection email
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Dear ${escapeHtml(application.full_name)},</p>
        <p>Thank you for your interest in joining the Chamber of Licensed Gold Buyers. After careful review, we regret to inform you that your membership application has not been approved at this time.</p>
        <p><strong>Reason:</strong> ${escapeHtml(reason)}</p>
        <p>If you have questions or would like to discuss this further, please contact us at <a href="mailto:info@chamberofgoldbuyers.com">info@chamberofgoldbuyers.com</a>.</p>
        <p>Best regards,<br>The CLGB Team</p>
      </div>
    `;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [application.email],
      subject: "CLGB Membership Application — Update",
      html,
    }).catch((err) => console.error("Rejection email failed:", err));
  }

  return NextResponse.json({ success: true });
}
