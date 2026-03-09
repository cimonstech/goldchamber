"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  CheckCircle,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  membership_tier: string | null;
  membership_status: string;
  membership_number: string | null;
  business_name: string | null;
  business_registration: string | null;
  business_address: string | null;
  gold_activity: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  residential_address: string | null;
  years_in_operation: string | null;
  how_heard: string | null;
  additional_info: string | null;
  applied_at: string | null;
  approved_at: string | null;
  expires_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

type Application = {
  id: string;
  submitted_at: string;
  membership_tier: string;
  status: string;
  review_notes: string | null;
};

type Ticket = {
  id: string;
  subject: string;
  status: string;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  active: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  suspended: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

const CARD_STYLE = {
  background: "#111111",
  border: "1px solid rgba(201,168,76,0.12)",
  borderRadius: 4,
  padding: 24,
};

function Field({ label, value, edit, onChange }: { label: string; value: string; edit?: boolean; onChange?: (v: string) => void }) {
  return (
    <div className="mb-4">
      <label
        className="block font-sans text-[10px] uppercase tracking-[2px] mb-1"
        style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        {label}
      </label>
      {edit && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      ) : (
        <p className="font-sans text-[13px]" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
          {value || "—"}
        </p>
      )}
    </div>
  );
}

export default function AdminMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPersonal, setEditPersonal] = useState(false);
  const [editBusiness, setEditBusiness] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "suspend" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: p } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (p) {
      setProfile(p as Profile);
      setEditForm(p as Profile);
      setNotes((p as Profile).admin_notes ?? "");
    }
    const { data: apps } = await supabase
      .from("applications")
      .select("id, submitted_at, membership_tier, status, review_notes")
      .eq("profile_id", id)
      .order("submitted_at", { ascending: false });
    setApplications((apps ?? []) as Application[]);
    const { data: tix } = await supabase
      .from("support_tickets")
      .select("id, subject, status")
      .eq("member_id", id);
    setTickets((tix ?? []) as Ticket[]);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchParams.get("edit") === "1") setEditPersonal(true);
  }, [searchParams]);

  const saveProfile = async (fields: Partial<Profile>) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
    setEditForm((f) => ({ ...f, ...fields }));
    setProfile((p) => (p ? { ...p, ...fields } : null));
    setEditPersonal(false);
    setEditBusiness(false);
  };

  const saveNotes = async () => {
    setNotesSaving(true);
    const supabase = createClient();
    try {
      await supabase.from("profiles").update({ admin_notes: notes, updated_at: new Date().toISOString() }).eq("id", id);
    } catch {
      // admin_notes column may not exist — run migrations/002_add_admin_notes.sql
    }
    setNotesSaving(false);
  };

  const runAction = async (status: "active" | "suspended" | "rejected") => {
    setActionLoading(true);
    const supabase = createClient();
    const payload: Record<string, unknown> = { membership_status: status };
    if (status === "active") {
      try {
        const { data: num } = await supabase.rpc("generate_membership_number");
        payload.membership_number = num ?? `CLGB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      } catch {
        payload.membership_number = `CLGB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      }
      payload.approved_at = new Date().toISOString();
    }
    await supabase.from("profiles").update(payload).eq("id", id);
    setConfirmAction(null);
    setActionLoading(false);
    fetchData();
  };

  if (loading || !profile) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[rgba(250,246,238,0.08)] mb-8" />
        <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-6">
          <div className="h-96 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
          <div className="h-64 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-2 mb-8 font-sans text-[11px] uppercase tracking-[2px]"
        style={{ color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        <ArrowLeft size={16} />
        Back to Members
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-display font-light"
                style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "#FAF6EE" }}
              >
                Personal Information
              </h2>
              <button
                type="button"
                onClick={() => setEditPersonal(!editPersonal)}
                className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)]"
                style={{ color: "#C9A84C" }}
              >
                <Edit2 size={16} />
              </button>
            </div>
            <Field label="Full Name" value={editForm.full_name ?? ""} edit={editPersonal} onChange={(v) => setEditForm((f) => ({ ...f, full_name: v }))} />
            <Field label="Email" value={editForm.email ?? ""} edit={editPersonal} onChange={(v) => setEditForm((f) => ({ ...f, email: v }))} />
            <Field label="Phone" value={editForm.phone ?? ""} edit={editPersonal} onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))} />
            <Field label="Nationality" value={editForm.nationality ?? ""} edit={editPersonal} onChange={(v) => setEditForm((f) => ({ ...f, nationality: v }))} />
            <Field label="Date of Birth" value={editForm.date_of_birth ?? ""} edit={editPersonal} onChange={(v) => setEditForm((f) => ({ ...f, date_of_birth: v }))} />
            <Field label="Residential Address" value={editForm.residential_address ?? ""} edit={editPersonal} onChange={(v) => setEditForm((f) => ({ ...f, residential_address: v }))} />
            {editPersonal && (
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => saveProfile(editForm)}
                  className="px-4 py-2 rounded font-sans text-[11px] font-bold uppercase"
                  style={{ background: "var(--gold-gradient)", color: "#050505" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setEditForm(profile); setEditPersonal(false); }}
                  className="px-4 py-2 rounded border font-sans text-[11px]"
                  style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Business Information */}
          <div style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-display font-light"
                style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "#FAF6EE" }}
              >
                Business Information
              </h2>
              <button
                type="button"
                onClick={() => setEditBusiness(!editBusiness)}
                className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)]"
                style={{ color: "#C9A84C" }}
              >
                <Edit2 size={16} />
              </button>
            </div>
            <Field label="Business Name" value={editForm.business_name ?? ""} edit={editBusiness} onChange={(v) => setEditForm((f) => ({ ...f, business_name: v }))} />
            <Field label="Business Registration" value={editForm.business_registration ?? ""} edit={editBusiness} onChange={(v) => setEditForm((f) => ({ ...f, business_registration: v }))} />
            <Field label="Business Address" value={editForm.business_address ?? ""} edit={editBusiness} onChange={(v) => setEditForm((f) => ({ ...f, business_address: v }))} />
            <Field label="Gold Activity" value={editForm.gold_activity ?? ""} edit={editBusiness} onChange={(v) => setEditForm((f) => ({ ...f, gold_activity: v }))} />
            <Field label="Years in Operation" value={editForm.years_in_operation ?? ""} edit={editBusiness} onChange={(v) => setEditForm((f) => ({ ...f, years_in_operation: v }))} />
            {editBusiness && (
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => saveProfile(editForm)}
                  className="px-4 py-2 rounded font-sans text-[11px] font-bold uppercase"
                  style={{ background: "var(--gold-gradient)", color: "#050505" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setEditForm(profile); setEditBusiness(false); }}
                  className="px-4 py-2 rounded border font-sans text-[11px]"
                  style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Application History */}
          <div style={CARD_STYLE}>
            <h2
              className="font-display font-light mb-6"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "#FAF6EE" }}
            >
              Application History
            </h2>
            {applications.length === 0 ? (
              <p className="font-sans text-[13px]" style={{ color: "rgba(250,246,238,0.5)" }}>No applications.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="font-sans text-[9px] uppercase tracking-[2px]" style={{ color: "rgba(250,246,238,0.4)" }}>
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-left py-2 pr-4">Tier</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => (
                    <tr key={a.id} className="border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                      <td className="py-3 pr-4 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.7)" }}>
                        {new Date(a.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.7)" }}>{a.membership_tier}</td>
                      <td className="py-3 pr-4">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[9px] uppercase"
                          style={{
                            ...(STATUS_STYLES[a.status] ?? {}),
                            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          }}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.5)" }}>
                        {a.review_notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Membership Status */}
          <div style={CARD_STYLE}>
            <h2
              className="font-display font-light mb-6 text-center"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "#FAF6EE" }}
            >
              Membership Status
            </h2>
            <div className="text-center mb-6">
              <span
                className="inline-block px-4 py-2 rounded-full font-sans text-[11px] uppercase tracking-[2px] font-bold"
                style={{
                  ...(STATUS_STYLES[profile.membership_status] ?? STATUS_STYLES.pending),
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {profile.membership_status}
              </span>
            </div>
            <div className="space-y-2 mb-6 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.7)" }}>
              <p><span className="text-[rgba(250,246,238,0.5)]">Tier:</span> {profile.membership_tier || "—"}</p>
              <p><span className="text-[rgba(250,246,238,0.5)]">Membership No.:</span> {profile.membership_number || "—"}</p>
              <p><span className="text-[rgba(250,246,238,0.5)]">Applied:</span> {profile.applied_at ? new Date(profile.applied_at).toLocaleDateString() : "—"}</p>
              <p><span className="text-[rgba(250,246,238,0.5)]">Approved:</span> {profile.approved_at ? new Date(profile.approved_at).toLocaleDateString() : "—"}</p>
              <p><span className="text-[rgba(250,246,238,0.5)]">Expires:</span> {profile.expires_at ? new Date(profile.expires_at).toLocaleDateString() : "—"}</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setConfirmAction("approve")}
                disabled={profile.membership_status === "active"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded font-sans text-[11px] font-bold uppercase disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }}
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("suspend")}
                disabled={profile.membership_status === "suspended"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded border font-sans text-[11px] font-bold uppercase disabled:opacity-50"
                style={{ borderColor: "#eab308", color: "#eab308" }}
              >
                <PauseCircle size={16} /> Suspend
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("reject")}
                disabled={profile.membership_status === "rejected"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded border font-sans text-[11px] font-bold uppercase disabled:opacity-50"
                style={{ borderColor: "#ef4444", color: "#ef4444" }}
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>

          {/* Support Tickets */}
          <div style={CARD_STYLE}>
            <h2
              className="font-display font-light mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "#FAF6EE" }}
            >
              Support Tickets
            </h2>
            {tickets.length === 0 ? (
              <p className="font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.5)" }}>No tickets.</p>
            ) : (
              <ul className="space-y-2">
                {tickets.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/communications?ticket=${t.id}`}
                      className="flex items-center justify-between font-sans text-[12px] py-2 hover:text-[#C9A84C] transition-colors"
                      style={{ color: "rgba(250,246,238,0.8)" }}
                    >
                      <span className="truncate">{t.subject}</span>
                      <span
                        className="ml-2 px-2 py-0.5 rounded text-[9px] uppercase shrink-0"
                        style={{
                          backgroundColor: "rgba(59,130,246,0.15)",
                          color: "#3b82f6",
                        }}
                      >
                        {t.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Notes */}
          <div style={CARD_STYLE}>
            <h2
              className="font-display font-light mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "#FAF6EE" }}
            >
              Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              rows={5}
              className={cn(inputBase, "resize-none")}
              placeholder="Admin internal notes..."
            />
            {notesSaving && (
              <p className="mt-2 font-sans text-[11px]" style={{ color: "rgba(250,246,238,0.4)" }}>Saving...</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setConfirmAction(null)} aria-hidden />
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded"
            style={{ background: "#111", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <h3 className="font-display text-xl mb-4" style={{ color: "#FAF6EE" }}>
              Confirm {confirmAction === "approve" ? "Approve" : confirmAction === "suspend" ? "Suspend" : "Reject"}?
            </h3>
            <p className="font-sans text-[13px] mb-6" style={{ color: "rgba(250,246,238,0.7)" }}>
              {confirmAction === "approve" && "This will set the member to active and generate a membership number."}
              {confirmAction === "suspend" && "This will suspend the member's access."}
              {confirmAction === "reject" && "This will reject the member's application."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => runAction(confirmAction === "approve" ? "active" : confirmAction === "suspend" ? "suspended" : "rejected")}
                disabled={actionLoading}
                className="px-4 py-2 rounded font-sans text-[11px] font-bold uppercase"
                style={{
                  background: confirmAction === "approve" ? "linear-gradient(135deg, #22c55e, #16a34a)" : confirmAction === "suspend" ? "#eab308" : "#ef4444",
                  color: "#fff",
                  border: "none",
                }}
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded border font-sans text-[11px]"
                style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
