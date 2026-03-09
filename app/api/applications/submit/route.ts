import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { uploadToR2, generateApplicationDocumentKey, isR2Configured } from "@/lib/r2";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Chamber of Gold Buyers <onboarding@resend.dev>";
const SITE_NAME = "Chamber of Licensed Gold Buyers";

const DOC_TYPES = ["ghana_card", "reg_certificate", "business_registration", "other"] as const;
const ALLOWED_DOC_TYPES = new Set<string>(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

async function sendAcknowledgementEmail(to: string, fullName: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <p>Dear ${escapeHtml(fullName)},</p>
      <p>Thank you for applying to join the ${SITE_NAME}. We have received your application and our team will review it within 48 hours.</p>
      <p>If approved, you will receive an email with instructions to set up your member account and access the portal.</p>
      <p>If you have any questions, please contact us at <a href="mailto:info@chamberofgoldbuyers.com">info@chamberofgoldbuyers.com</a>.</p>
      <p>Best regards,<br>The CLGB Team</p>
    </div>
  `;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `Application Received — ${SITE_NAME}`,
    html,
  });
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text).replace(/[&<>"']/g, (c) => map[c] ?? c);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  let body: Record<string, unknown>;
  const documents: { type: string; file: File }[] = [];

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    body = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      nationality: formData.get("nationality"),
      residentialAddress: formData.get("residentialAddress"),
      businessName: formData.get("businessName"),
      businessRegistration: formData.get("businessRegistration"),
      businessAddress: formData.get("businessAddress"),
      yearsInOperation: formData.get("yearsInOperation"),
      goldActivity: formData.get("goldActivity"),
      membershipTier: formData.get("membershipTier"),
      howHeard: formData.get("howHeard"),
      additionalInfo: formData.get("additionalInfo"),
    } as Record<string, unknown>;
    // Collect documents: document0+document0Type, document1+document1Type, ...
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`document${i}`) as File | null;
      const type = formData.get(`document${i}Type`) as string | null;
      if (file && file.size > 0 && type && DOC_TYPES.includes(type as (typeof DOC_TYPES)[number])) {
        documents.push({ type, file });
      }
    }
  } else {
    body = (await req.json()) as Record<string, unknown>;
  }

  const email = String(body.email ?? "").trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if an application with this email already exists
  const { data: existing } = await supabaseAdmin
    .from("applications")
    .select("id, status")
    .eq("email", email)
    .single();

  if (existing) {
    if (existing.status === "pending" || existing.status === "reviewing") {
      return NextResponse.json(
        { error: "An application with this email is already under review." },
        { status: 409 }
      );
    }
    if (existing.status === "approved") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
  }

  // Validate documents
  for (const { file, type } of documents) {
    if (!ALLOWED_DOC_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid document type for ${type}. Allowed: PDF, JPEG, PNG, WebP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_DOC_SIZE) {
      return NextResponse.json(
        { error: `Document ${type} is too large. Max 10MB.` },
        { status: 400 }
      );
    }
  }

  const fullName = String(body.fullName ?? "").trim();

  // Insert application — no user account created yet
  const { data, error } = await supabaseAdmin
    .from("applications")
    .insert({
      full_name: fullName,
      email,
      phone: body.phone ?? null,
      date_of_birth: body.dateOfBirth || null,
      nationality: body.nationality ?? null,
      residential_address: body.residentialAddress ?? null,
      business_name: body.businessName ?? null,
      business_registration: body.businessRegistration ?? null,
      business_address: body.businessAddress ?? null,
      years_in_operation: body.yearsInOperation ?? null,
      gold_activity: body.goldActivity ?? null,
      membership_tier: body.membershipTier ?? null,
      how_heard: body.howHeard ?? null,
      additional_info: body.additionalInfo || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Upload documents to R2 and save to application_documents
  if (documents.length > 0 && isR2Configured()) {
    for (const { type, file } of documents) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const key = generateApplicationDocumentKey(data.id, type, fullName, file.name);
        const url = await uploadToR2({
          key,
          body: buffer,
          contentType: file.type,
          metadata: { originalName: file.name },
        });
        if (url) {
          await supabaseAdmin.from("application_documents").insert({
            application_id: data.id,
            document_type: type,
            file_url: url,
            file_name: file.name,
            file_key: key,
          });
        }
      } catch (err) {
        console.error("Document upload failed:", err);
      }
    }
  }

  // Send acknowledgement email to applicant (non-blocking)
  sendAcknowledgementEmail(email, fullName).catch((err) =>
    console.error("Acknowledgement email failed:", err)
  );

  return NextResponse.json({ success: true, applicationId: data.id });
}
