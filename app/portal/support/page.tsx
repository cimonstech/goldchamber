"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

type TicketMessage = {
  id: string;
  message: string;
  is_admin: boolean;
  sender_id: string | null;
  created_at: string;
};

type Profile = {
  full_name: string | null;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  open: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  in_progress: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  resolved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  closed: { bg: "var(--bg-card)", color: "var(--text-secondary)", border: "var(--border-subtle)" },
};

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  low: { bg: "var(--gold-glow)", color: "var(--text-muted)" },
  normal: { bg: "var(--gold-glow)", color: "var(--gold-primary)" },
  high: { bg: "rgba(234,179,8,0.15)", color: "#eab308" },
  urgent: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
};

const inputBase =
  "w-full rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border input-dashboard focus:border-[var(--gold-primary)]";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PortalSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [newMessage, setNewMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTickets = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("support_tickets")
      .select("id, subject, status, priority, created_at, updated_at")
      .eq("member_id", user.id)
      .order("updated_at", { ascending: false });
    setTickets((data ?? []) as Ticket[]);
  }, []);

  useEffect(() => {
    fetchTickets().then(() => setLoading(false));
  }, [fetchTickets]);

  const fetchMessages = useCallback(async (ticketId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("ticket_messages")
      .select("id, message, is_admin, sender_id, created_at")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    const msgs = (data ?? []) as TicketMessage[];
    setMessages(msgs);
    const senderIds = [...new Set(msgs.map((m) => m.sender_id).filter(Boolean))] as string[];
    if (senderIds.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", senderIds);
      const map: Record<string, Profile> = {};
      (profs ?? []).forEach((p: { id: string; full_name: string | null }) => {
        map[p.id] = { full_name: p.full_name };
      });
      setProfiles(map);
    }
  }, []);

  useEffect(() => {
    if (selectedTicket) fetchMessages(selectedTicket.id);
    else setMessages([]);
  }, [selectedTicket, fetchMessages]);

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("ticket_messages").insert({
      ticket_id: selectedTicket.id,
      sender_id: user.id,
      message: replyText.trim(),
      is_admin: false,
    });
    await supabase.from("support_tickets").update({ updated_at: new Date().toISOString() }).eq("id", selectedTicket.id);
    setReplyText("");
    fetchMessages(selectedTicket.id);
    fetchTickets();
    setSending(false);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    setCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: ticket } = await supabase
      .from("support_tickets")
      .insert({ member_id: user.id, subject: newSubject.trim(), status: "open", priority: newPriority })
      .select("id, subject, status, priority, created_at, updated_at")
      .single();
    if (ticket) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message: newMessage.trim(),
        is_admin: false,
      });
      setTickets((prev) => [ticket as Ticket, ...prev]);
      setSelectedTicket(ticket as Ticket);
      setShowNewModal(false);
      setNewSubject("");
      setNewPriority("normal");
      setNewMessage("");
      fetchMessages(ticket.id);
    }
    setCreating(false);
  };

  const cardStyle = { background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-12 w-48 animate-pulse rounded bg-[var(--gold-glow)] mb-8" />
        <div className="h-96 animate-pulse rounded bg-[var(--gold-glow)]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — ticket list */}
        <div className="lg:col-span-1">
          <div className="p-4 rounded mb-4" style={cardStyle}>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border transition-colors hover:bg-[var(--gold-glow)]"
              style={{ borderColor: "var(--gold-primary)", color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}
            >
              <Plus size={16} />
              New Ticket
            </button>
          </div>
          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTicket(t)}
                className={`w-full text-left p-4 rounded transition-colors ${
                  selectedTicket?.id === t.id ? "bg-[var(--gold-glow)] border-[var(--input-border)]" : "border-transparent"
                }`}
                style={{ ...cardStyle, borderWidth: 1 }}
              >
                <p className="font-sans text-[13px] mb-1 truncate" style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{t.subject}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full font-sans text-[9px] uppercase"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      backgroundColor: (STATUS_STYLES[t.status] ?? STATUS_STYLES.open).bg,
                      color: (STATUS_STYLES[t.status] ?? STATUS_STYLES.open).color,
                      border: `1px solid ${(STATUS_STYLES[t.status] ?? STATUS_STYLES.open).border}`,
                    }}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  <span
                    className="inline-block px-2 py-0.5 rounded font-sans text-[8px] uppercase"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      backgroundColor: (PRIORITY_STYLES[t.priority] ?? PRIORITY_STYLES.normal).bg,
                      color: (PRIORITY_STYLES[t.priority] ?? PRIORITY_STYLES.normal).color,
                    }}
                  >
                    {t.priority}
                  </span>
                </div>
                <p className="font-sans text-[10px] mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  {formatDate(t.updated_at)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right — ticket detail */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded min-h-[400px] flex flex-col" style={cardStyle}>
            {!selectedTicket ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <p
                  className="font-sans text-[14px]"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Select a ticket to view the conversation.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2
                    className="font-display font-light mb-2"
                    style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "var(--text-primary)" }}
                  >
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex gap-2">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full font-sans text-[9px] uppercase"
                      style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        backgroundColor: (STATUS_STYLES[selectedTicket.status] ?? STATUS_STYLES.open).bg,
                        color: (STATUS_STYLES[selectedTicket.status] ?? STATUS_STYLES.open).color,
                        border: `1px solid ${(STATUS_STYLES[selectedTicket.status] ?? STATUS_STYLES.open).border}`,
                      }}
                    >
                      {selectedTicket.status.replace("_", " ")}
                    </span>
                    <span
                      className="inline-block px-2.5 py-1 rounded font-sans text-[9px] uppercase"
                      style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        backgroundColor: (PRIORITY_STYLES[selectedTicket.priority] ?? PRIORITY_STYLES.normal).bg,
                        color: (PRIORITY_STYLES[selectedTicket.priority] ?? PRIORITY_STYLES.normal).color,
                      }}
                    >
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[320px]">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.is_admin ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 ${
                          m.is_admin
                            ? "rounded-[16px_16px_16px_4px]"
                            : "rounded-[16px_16px_4px_16px]"
                        }`}
                        style={{
                          background: m.is_admin ? "var(--bg-tertiary)" : "var(--border-subtle)",
                          border: m.is_admin ? "1px solid var(--border-subtle)" : "1px solid var(--input-border)",
                        }}
                      >
                        <p className="font-sans text-[13px] whitespace-pre-wrap" style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{m.message}</p>
                        <p className="font-sans text-[10px] mt-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                          {m.is_admin ? "CLGB Support" : (profiles[m.sender_id ?? ""]?.full_name ?? "You")} · {formatDate(m.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={2}
                    className={`${inputBase} resize-none flex-1`}
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    className="px-4 py-2 rounded flex items-center gap-2 shrink-0 disabled:opacity-50"
                    style={{ backgroundColor: "var(--gold-primary)", color: "var(--bg-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New ticket modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowNewModal(false)}>
          <div
            className="max-w-md w-full mx-4 p-6 rounded"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--input-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-display font-medium mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
            >
              New Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Brief subject"
                  className={inputBase}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className={inputBase}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Message</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your issue..."
                  rows={4}
                  className={`${inputBase} resize-none`}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded border font-sans text-[12px]"
                  style={{ borderColor: "var(--input-border)", color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded font-sans text-[12px] font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "var(--gold-primary)", color: "var(--bg-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
