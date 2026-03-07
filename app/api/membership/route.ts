import { NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Chamber of Gold Buyers <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "info@chamberofgoldbuyers.com";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Membership service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const { name, company, email, phone, license, tier, message } = body;

    if (!name || !email || !tier) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, tier" },
        { status: 400 }
      );
    }

    const html = `
      <h2>New membership application from CLGB website</h2>
      <p><strong>Tier:</strong> ${escapeHtml(tier)}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${license ? `<p><strong>GoldBod License:</strong> ${escapeHtml(license)}</p>` : ""}
      ${message ? `<h3>Additional Information</h3><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
      <hr>
      <p style="color:#888;font-size:12px;">Sent via Chamber of Licensed Gold Buyers membership form</p>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[CLGB Membership] ${tier} — ${name}`,
      html,
    });

    if (error) {
      console.error("Resend membership error:", error);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Membership API error:", err);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (c) => map[c] ?? c);
}
