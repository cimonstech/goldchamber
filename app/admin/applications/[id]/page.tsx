"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MessageCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Application = {
  id: string;
  profile_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  residential_address: string | null;
  business_name: string | null;
  business_registration: string | null;
  business_address: string | null;
  years_in_operation: string | null;
  gold_activity: string | null;
  membership_tier: string;
  how_heard: string | null;
  additional_info: string | null;
  status: string;
  review_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  reviewing: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

const inputBase =
  "w-full rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border bg-[#0a0a0a] border-[rgba(201,168,76,0.2)] text-[#FAF6EE] placeholder:text-[rgba(250,246,238,0.4)] focus:border-[var(--gold-primary)]";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="mb-4">
      <label
        className="block font-sans text-[10px] uppercase tracking-[2px] mb-1.5"
        style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        {label}
      </label>
      <p
        className="font-sans text-[14px]"
        style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3
        className="font-display font-medium mb-4"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 18,
          color: "#C9A84C",
        }}
      >
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "request_info" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [requestInfoMessage, setRequestInfoMessage] = useState("");

  const fetchApp = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();
    if (error || !data) {
      setApp(null);
      return;
    }
    setApp(data as Application);
    setReviewNotes((data as Application).review_notes ?? "");
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const saveNotes = async () => {
    if (!app) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("applications").update({ review_notes: reviewNotes }).eq("id", app.id);
    setSaving(false);
  };

  const handleApprove = async () => {
    if (!app) return;
    setSaving(true);
    const supabase = createClient();
    let membershipNumber: string;
    try {
      const { data } = await supabase.rpc("generate_membership_number");
      membershipNumber = data ?? `CLGB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    } catch {
      membershipNumber = `CLGB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    }
    const now = new Date().toISOString();
    await supabase
      .from("applications")
      .update({ status: "approved", reviewed_at: now, review_notes: reviewNotes })
      .eq("id", app.id);
    if (app.profile_id) {
      await supabase
        .from("profiles")
        .update({
          membership_status: "active",
          membership_number: membershipNumber,
          membership_tier: app.membership_tier,
          approved_at: now,
          full_name: app.full_name,
          email: app.email,
          phone: app.phone,
          business_name: app.business_name,
          business_registration: app.business_registration,
          business_address: app.business_address,
          gold_activity: app.gold_activity,
          nationality: app.nationality,
          date_of_birth: app.date_of_birth,
          residential_address: app.residential_address,
          years_in_operation: app.years_in_operation,
          how_heard: app.how_heard,
          additional_info: app.additional_info,
        })
        .eq("id", app.profile_id);
    }
    // TODO: Send approval notification email to applicant
    console.log("TODO: Send approval notification to", app.email, { membershipNumber });
    setConfirmAction(null);
    setSaving(false);
    router.push("/admin/applications");
  };

  const handleReject = async () => {
    if (!app || !rejectReason.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const now = new Date().toISOString();
    await supabase
      .from("applications")
      .update({
        status: "rejected",
        reviewed_at: now,
        review_notes: reviewNotes ? `${reviewNotes}\n\nRejection reason: ${rejectReason}` : `Rejection reason: ${rejectReason}`,
      })
      .eq("id", app.id);
    if (app.profile_id) {
      await supabase.from("profiles").update({ membership_status: "rejected" }).eq("id", app.profile_id);
    }
    // TODO: Send rejection notification email to applicant
    console.log("TODO: Send rejection notification to", app.email, { reason: rejectReason });
    setConfirmAction(null);
    setRejectReason("");
    setSaving(false);
    router.push("/admin/applications");
  };

  const handleRequestMoreInfo = async () => {
    if (!app) return;
    setSaving(true);
    const supabase = createClient();
    const now = new Date().toISOString();
    await supabase
      .from("applications")
      .update({ status: "reviewing", reviewed_at: now, review_notes: reviewNotes })
      .eq("id", app.id);
    // TODO: Send "request more info" email to applicant with requestInfoMessage
    console.log("TODO: Send request-more-info email to", app.email, { message: requestInfoMessage });
    setRequestInfoMessage("");
    setConfirmAction(null);
    setSaving(false);
    router.push("/admin/applications");
  };

  if (loading || !app) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[rgba(250,246,238,0.08)] mb-8" />
        <div className="h-64 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 font-sans text-[12px] uppercase tracking-[2px] mb-6 hover:opacity-80 transition-opacity"
        style={{ color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        <ArrowLeft size={16} />
        Back to Applications
      </Link>

      <h1
        className="font-display font-light mb-8"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 28,
          color: "#FAF6EE",
        }}
      >
        Application: {app.full_name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Application details */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="p-6 rounded"
            style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.12)" }}
          >
            <Section title="Personal Information">
              <Field label="Full Name" value={app.full_name} />
              <Field label="Email" value={app.email} />
              <Field label="Phone" value={app.phone} />
              <Field label="Date of Birth" value={app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString() : null} />
              <Field label="Nationality" value={app.nationality} />
              <Field label="Residential Address" value={app.residential_address} />
            </Section>
            <Section title="Business Information">
              <Field label="Business Name" value={app.business_name} />
              <Field label="Business Registration" value={app.business_registration} />
              <Field label="Business Address" value={app.business_address} />
              <Field label="Years in Operation" value={app.years_in_operation} />
              <Field label="Gold Activity" value={app.gold_activity} />
            </Section>
            <Section title="Membership Selection">
              <Field label="Membership Tier" value={app.membership_tier} />
              <Field label="How Heard" value={app.how_heard} />
              <Field label="Additional Info" value={app.additional_info} />
            </Section>
          </div>
        </div>

        {/* RIGHT — Review panel */}
        <div>
          <div
            className="p-6 rounded sticky top-8"
            style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.12)" }}
          >
            <div className="mb-4">
              <span
                className="inline-block px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-[1px]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  backgroundColor: (STATUS_STYLES[app.status] ?? STATUS_STYLES.pending).bg,
                  color: (STATUS_STYLES[app.status] ?? STATUS_STYLES.pending).color,
                  border: `1px solid ${(STATUS_STYLES[app.status] ?? STATUS_STYLES.pending).border}`,
                }}
              >
                {app.status}
              </span>
            </div>

            <label
              className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
              style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Review Notes
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Add internal review notes..."
              rows={4}
              className={`${inputBase} resize-y min-h-[100px]`}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            />

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setConfirmAction("approve")}
                disabled={saving || app.status === "approved"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "rgba(34,197,94,0.15)",
                  borderColor: "rgba(34,197,94,0.5)",
                  color: "#22c55e",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "1px",
                }}
              >
                <CheckCircle size={18} />
                Approve Application
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("request_info")}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded border transition-colors hover:bg-[rgba(201,168,76,0.08)] disabled:opacity-50"
                style={{
                  borderColor: "#C9A84C",
                  color: "#C9A84C",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "1px",
                }}
              >
                <MessageCircle size={18} />
                Request More Info
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("reject")}
                disabled={saving || app.status === "rejected"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded border transition-colors hover:bg-[rgba(239,68,68,0.08)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: "rgba(239,68,68,0.5)",
                  color: "#ef4444",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "1px",
                }}
              >
                <XCircle size={18} />
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Approve modal */}
      {confirmAction === "approve" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setConfirmAction(null)}>
          <div
            className="max-w-md w-full mx-4 p-6 rounded"
            style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-sans text-[14px] mb-6" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Are you sure you want to approve this application?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded border font-sans text-[12px]"
                style={{ borderColor: "rgba(250,246,238,0.3)", color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={saving}
                className="px-4 py-2 rounded font-sans text-[12px] font-semibold"
                style={{ backgroundColor: "#22c55e", color: "#050505", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal — requires reason */}
      {confirmAction === "reject" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => { setConfirmAction(null); setRejectReason(""); }}>
          <div
            className="max-w-md w-full mx-4 p-6 rounded"
            style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-sans text-[14px] mb-2" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Are you sure you want to reject this application?
            </p>
            <p className="font-sans text-[12px] mb-4" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Please provide a rejection reason (required):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason..."
              rows={3}
              className={`${inputBase} mb-6 resize-y`}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setConfirmAction(null); setRejectReason(""); }}
                className="px-4 py-2 rounded border font-sans text-[12px]"
                style={{ borderColor: "rgba(250,246,238,0.3)", color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={saving || !rejectReason.trim()}
                className="px-4 py-2 rounded font-sans text-[12px] font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#ef4444", color: "#fff", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request More Info modal */}
      {confirmAction === "request_info" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => { setConfirmAction(null); setRequestInfoMessage(""); }}>
          <div
            className="max-w-md w-full mx-4 p-6 rounded"
            style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-sans text-[14px] mb-2" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Request more information from the applicant
            </p>
            <p className="font-sans text-[12px] mb-4" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              This message will be sent to the applicant (TODO: email integration).
            </p>
            <textarea
              value={requestInfoMessage}
              onChange={(e) => setRequestInfoMessage(e.target.value)}
              placeholder="Type your message to the applicant..."
              rows={4}
              className={`${inputBase} mb-6 resize-y`}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setConfirmAction(null); setRequestInfoMessage(""); }}
                className="px-4 py-2 rounded border font-sans text-[12px]"
                style={{ borderColor: "rgba(250,246,238,0.3)", color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestMoreInfo}
                disabled={saving}
                className="px-4 py-2 rounded font-sans text-[12px] font-semibold"
                style={{ backgroundColor: "#C9A84C", color: "#050505", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
