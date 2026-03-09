import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Verify the requester is an admin
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

  const { applicationId } = await req.json();

  // Get the application
  const { data: application, error: appError } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Generate membership number
  const { data: membershipNumber } = await supabaseAdmin.rpc("generate_membership_number");
  const membershipNumberStr =
    membershipNumber ?? `CLGB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://goldchamber.vercel.app";

  // Create the Supabase auth user and send invite email (password setup link)
  // redirectTo must be in Supabase: Authentication → URL Configuration → Redirect URLs
  const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    application.email,
    {
      redirectTo: `${siteUrl}/auth/callback?next=/auth/set-password`,
      data: {
        full_name: application.full_name,
        role: "member",
      },
    }
  );

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!newUser.user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  // Update the auto-created profile with full application data
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: application.full_name,
      phone: application.phone,
      role: "member",
      membership_tier: application.membership_tier,
      membership_status: "active",
      membership_number: membershipNumberStr,
      business_name: application.business_name,
      business_registration: application.business_registration,
      business_address: application.business_address,
      gold_activity: application.gold_activity,
      nationality: application.nationality,
      date_of_birth: application.date_of_birth,
      residential_address: application.residential_address,
      years_in_operation: application.years_in_operation,
      how_heard: application.how_heard,
      additional_info: application.additional_info,
      approved_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    })
    .eq("id", newUser.user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Update application status and link to profile
  await supabaseAdmin
    .from("applications")
    .update({
      status: "approved",
      profile_id: newUser.user.id,
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  return NextResponse.json({
    success: true,
    membershipNumber: membershipNumberStr,
    userId: newUser.user.id,
  });
}
