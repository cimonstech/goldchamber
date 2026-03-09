"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  membership_tier: string | null;
  membership_number: string | null;
  membership_status: string;
  expires_at: string | null;
  approved_at: string | null;
};

const inputBase =
  "w-full rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border input-dashboard focus:border-[var(--gold-primary)]";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Days until expiry */
function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PortalRenewalPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("membership_tier, membership_number, membership_status, expires_at, approved_at")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data as Profile | null);
          setLoading(false);
        }, () => setLoading(false));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    const msg = message.trim();

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: ticket } = await supabase
      .from("support_tickets")
      .insert({ member_id: user.id, subject: "Membership Renewal Request", status: "open", priority: "normal" })
      .select("id")
      .single();

    if (ticket) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message: msg || "I would like to request membership renewal.",
        is_admin: false,
      });
    }
    // TODO: Connect to payment gateway

    setSubmitting(false);
    setSubmitted(true);
    setMessage("");
  };

  const cardStyle = { background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" };
  const daysLeft = daysUntil(profile?.expires_at ?? null);
  const isNearExpiry = daysLeft != null && daysLeft <= 60;
  const isActive = profile?.membership_status === "active";

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-12 w-48 animate-pulse rounded bg-[rgba(250,246,238,0.08)] mb-8" />
        <div className="h-64 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        Renewal
      </h1>

      {/* Current membership status */}
      <div className="p-6 rounded mb-8" style={cardStyle}>
        <h2
          className="font-display font-medium mb-4"
          style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
        >
          Current Membership
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="font-sans text-[12px] uppercase tracking-[2px] mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Tier</p>
            <p className="font-sans text-[14px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{profile?.membership_tier ?? "—"}</p>
          </div>
          <div>
            <p className="font-sans text-[12px] uppercase tracking-[2px] mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Membership No.</p>
            <p className="font-mono text-[14px]" style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{profile?.membership_number ?? "—"}</p>
          </div>
          <div>
            <p className="font-sans text-[12px] uppercase tracking-[2px] mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Expires</p>
            <p className="font-sans text-[14px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{formatDate(profile?.expires_at ?? null)}</p>
          </div>
        </div>
        {isActive && !isNearExpiry && (
          <div className="flex items-center gap-2 text-[#22c55e]">
            <CheckCircle size={20} />
            <span className="font-sans text-[10px] uppercase tracking-[2px]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Your membership is active and in good standing.
            </span>
          </div>
        )}
      </div>

      {/* Renewal form */}
      <div className="p-6 rounded max-w-xl" style={cardStyle}>
        <h2
          className="font-display font-medium mb-4"
          style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
        >
          Request Renewal
        </h2>
        {submitted ? (
          <p className="font-sans text-[14px]" style={{ color: "#22c55e", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
            Your renewal request has been submitted. We will contact you shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Message</label>
              <textarea
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add any notes for your renewal request..."
                className={`${inputBase} resize-none`}
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded border font-sans text-[11px] uppercase tracking-[2px] font-semibold disabled:opacity-50"
              style={{ borderColor: "#C9A84C", color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {submitting ? "Submitting…" : "Request Renewal"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
