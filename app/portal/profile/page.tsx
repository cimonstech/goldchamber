"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border input-dashboard focus:border-[var(--gold-primary)]";

type Profile = {
  full_name: string | null;
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
  membership_tier: string | null;
  how_heard: string | null;
  additional_info: string | null;
};

export default function PortalProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState<Profile>({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    nationality: "",
    residential_address: "",
    business_name: "",
    business_registration: "",
    business_address: "",
    years_in_operation: "",
    gold_activity: "",
    membership_tier: "",
    how_heard: "",
    additional_info: "",
  });
  const [passwordForm, setPasswordForm] = useState({ password: "", confirm: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("full_name, email, phone, date_of_birth, nationality, residential_address, business_name, business_registration, business_address, years_in_operation, gold_activity, membership_tier, how_heard, additional_info")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data as Profile);
            setForm({
              full_name: data.full_name ?? "",
              email: data.email ?? "",
              phone: data.phone ?? "",
              date_of_birth: data.date_of_birth ? String(data.date_of_birth).slice(0, 10) : "",
              nationality: data.nationality ?? "",
              residential_address: data.residential_address ?? "",
              business_name: data.business_name ?? "",
              business_registration: data.business_registration ?? "",
              business_address: data.business_address ?? "",
              years_in_operation: data.years_in_operation ?? "",
              gold_activity: data.gold_activity ?? "",
              membership_tier: data.membership_tier ?? "",
              how_heard: data.how_heard ?? "",
              additional_info: data.additional_info ?? "",
            });
          }
          setLoading(false);
        }, () => setLoading(false));
    });
  }, []);

  const updateForm = (key: keyof Profile, value: string | null) => {
    setForm((p) => ({ ...p, [key]: value ?? "" }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        phone: form.phone || null,
        date_of_birth: form.date_of_birth || null,
        nationality: form.nationality || null,
        residential_address: form.residential_address || null,
        business_name: form.business_name || null,
        business_registration: form.business_registration || null,
        business_address: form.business_address || null,
        years_in_operation: form.years_in_operation || null,
        gold_activity: form.gold_activity || null,
        how_heard: form.how_heard || null,
        additional_info: form.additional_info || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Profile updated." });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (passwordForm.password !== passwordForm.confirm) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (passwordForm.password.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setPasswordSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwordForm.password });
    setPasswordSaving(false);
    if (error) setPasswordMessage({ type: "error", text: error.message });
    else {
      setPasswordMessage({ type: "success", text: "Password updated." });
      setPasswordForm({ password: "", confirm: "" });
    }
  };

  const handleRequestDeletion = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: ticket } = await supabase
      .from("support_tickets")
      .insert({ member_id: user.id, subject: "Account Deletion Request", status: "open", priority: "high" })
      .select("id")
      .single();
    if (ticket) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message: "I would like to request deletion of my account.",
        is_admin: false,
      });
    }
    setMessage({ type: "success", text: "Support ticket created. We will contact you shortly." });
  };

  const cardStyle = { background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-12 w-48 animate-pulse rounded bg-[rgba(250,246,238,0.08)] mb-8" />
        <div className="h-96 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Profile form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="p-6 rounded" style={cardStyle}>
            <h2
              className="font-display font-medium mb-6"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
            >
              Personal Information
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Full Name</label>
                <input type="text" value={form.full_name ?? ""} onChange={(e) => updateForm("full_name", e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Email</label>
                <input type="email" value={form.email} disabled className={inputBase} style={{ opacity: 0.7 }} />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Phone</label>
                <input type="tel" value={form.phone ?? ""} onChange={(e) => updateForm("phone", e.target.value)} className={inputBase} placeholder="+233 XX XXX XXXX" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Date of Birth</label>
                  <input type="date" value={form.date_of_birth ?? ""} onChange={(e) => updateForm("date_of_birth", e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Nationality</label>
                  <input type="text" value={form.nationality ?? ""} onChange={(e) => updateForm("nationality", e.target.value)} className={inputBase} placeholder="e.g. Ghanaian" />
                </div>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Residential Address</label>
                <textarea rows={2} value={form.residential_address ?? ""} onChange={(e) => updateForm("residential_address", e.target.value)} className={`${inputBase} resize-none`} />
              </div>
            </div>

            <h2
              className="font-display font-medium mb-6"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
            >
              Business Information
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Business / Company Name</label>
                <input type="text" value={form.business_name ?? ""} onChange={(e) => updateForm("business_name", e.target.value)} className={inputBase} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Business Registration Number</label>
                  <input type="text" value={form.business_registration ?? ""} onChange={(e) => updateForm("business_registration", e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Years in Operation</label>
                  <select value={form.years_in_operation ?? ""} onChange={(e) => updateForm("years_in_operation", e.target.value)} className={inputBase}>
                    <option value="">Select</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1–3 years">1–3 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="5–10 years">5–10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Business Address</label>
                <textarea rows={2} value={form.business_address ?? ""} onChange={(e) => updateForm("business_address", e.target.value)} className={`${inputBase} resize-none`} />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Type of Gold Activity</label>
                <select value={form.gold_activity ?? ""} onChange={(e) => updateForm("gold_activity", e.target.value)} className={inputBase}>
                  <option value="">Select</option>
                  <option value="Buying">Buying</option>
                  <option value="Selling">Selling</option>
                  <option value="Both">Both</option>
                  <option value="Mining">Mining</option>
                  <option value="Processing">Processing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>How did you hear about us?</label>
                <select value={form.how_heard ?? ""} onChange={(e) => updateForm("how_heard", e.target.value)} className={inputBase}>
                  <option value="">Select</option>
                  <option value="GoldBod">GoldBod</option>
                  <option value="Ghana Minerals Commission">Ghana Minerals Commission</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="News Article">News Article</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Additional Information</label>
                <textarea rows={3} value={form.additional_info ?? ""} onChange={(e) => updateForm("additional_info", e.target.value)} className={`${inputBase} resize-none`} />
              </div>
            </div>

            {message && (
              <p className="mb-4 font-sans text-[13px]" style={{ color: message.type === "error" ? "#ef4444" : "#22c55e", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{message.text}</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded border font-sans text-[11px] uppercase tracking-[2px] font-semibold disabled:opacity-50"
              style={{ borderColor: "#C9A84C", color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>

        {/* Right — Account settings */}
        <div className="space-y-6">
          <div className="p-6 rounded" style={cardStyle}>
            <h2
              className="font-display font-medium mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
            >
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>New Password</label>
                <input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm((p) => ({ ...p, password: e.target.value }))} className={inputBase} placeholder="••••••••" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Confirm Password</label>
                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} className={inputBase} placeholder="••••••••" />
              </div>
              {passwordMessage && (
                <p className="font-sans text-[13px]" style={{ color: passwordMessage.type === "error" ? "#ef4444" : "#22c55e", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{passwordMessage.text}</p>
              )}
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-4 py-2 rounded border font-sans text-[11px] uppercase tracking-[2px] font-semibold disabled:opacity-50"
                style={{ borderColor: "#C9A84C", color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Update Password
              </button>
            </form>
          </div>

          <div className="p-6 rounded" style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.3)" }}>
            <h2
              className="font-display font-medium mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "#ef4444" }}
            >
              Danger Zone
            </h2>
            <p className="font-sans text-[13px] mb-4" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Request permanent deletion of your account. A support ticket will be created and our team will contact you.
            </p>
            <button
              type="button"
              onClick={handleRequestDeletion}
              className="px-4 py-2 rounded border font-sans text-[11px] uppercase tracking-[2px] font-semibold"
              style={{ borderColor: "#ef4444", color: "#ef4444", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Request Account Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
