"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  Search,
  Eye,
  Edit2,
  MoreVertical,
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
  membership_number: string | null;
  membership_tier: string | null;
  membership_status: string;
  applied_at: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  active: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  suspended: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

const TIER_OPTIONS = ["All Tiers", "Associate", "Full Member", "Corporate"];
const STATUS_OPTIONS = ["All Status", "Pending", "Active", "Suspended", "Rejected"];
const PAGE_SIZES = [10, 25, 50];

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function escapeCsv(val: string | null): string {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function AdminMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search: searchDebounced,
      tier: tierFilter,
      status: statusFilter,
      page: String(page),
      pageSize: String(pageSize),
    });
    const res = await fetch(`/api/admin/members?${params}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Members fetch failed:", res.status, err?.error ?? res.statusText);
      setMembers([]);
      setTotal(0);
    } else {
      const { data, count } = await res.json();
      setMembers((data ?? []) as Profile[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [searchDebounced, tierFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const hasFilters = searchDebounced || tierFilter !== "All Tiers" || statusFilter !== "All Status";
  const clearFilters = () => {
    setSearch("");
    setSearchDebounced("");
    setTierFilter("All Tiers");
    setStatusFilter("All Status");
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (selected.size === members.length) setSelected(new Set());
    else setSelected(new Set(members.map((m) => m.id)));
  };

  const exportCsv = async () => {
    const res = await fetch("/api/admin/members?export=1");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clgb-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSelectedCsv = () => {
    const toExport = members.filter((m) => selected.has(m.id));
    const headers = ["Full Name", "Email", "Membership No.", "Tier", "Status", "Applied", "Created"];
    const csv = [
      headers.join(","),
      ...toExport.map((r) =>
        [
          escapeCsv(r.full_name),
          escapeCsv(r.email),
          escapeCsv(r.membership_number),
          escapeCsv(r.membership_tier),
          escapeCsv(r.membership_status),
          escapeCsv(r.applied_at),
          escapeCsv(r.created_at),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clgb-members-selected-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bulkAction = async (status: "active" | "suspended" | "rejected") => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    const supabase = createClient();
    for (const id of selected) {
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
    }
    setSelected(new Set());
    await fetchMembers();
    setBulkLoading(false);
  };

  const singleAction = async (id: string, status: "active" | "suspended" | "rejected") => {
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
    setDropdownOpen(null);
    fetchMembers();
  };

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="font-display font-light"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontSize: 28,
            color: "#FAF6EE",
          }}
        >
          Members
        </h1>
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded border transition-colors hover:bg-[rgba(201,168,76,0.08)]"
          style={{
            borderColor: "var(--gold-primary)",
            color: "#C9A84C",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative w-[320px]">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or membership number..."
            className={inputBase}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
          className={inputBase}
          style={{ width: 160 }}
        >
          {TIER_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className={inputBase}
          style={{ width: 160 }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-sans text-[11px] uppercase tracking-[2px] self-center"
            style={{ color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div
          className="flex items-center gap-4 mb-4 py-3 px-4 rounded"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <span
            className="font-sans text-[12px]"
            style={{ color: "rgba(250,246,238,0.8)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {selected.size} member{selected.size !== 1 ? "s" : ""} selected
          </span>
          <button
            type="button"
            onClick={() => bulkAction("active")}
            disabled={bulkLoading}
            className="flex items-center gap-2 px-4 py-2 rounded border transition-colors"
            style={{
              borderColor: "#22c55e",
              color: "#22c55e",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            <CheckCircle size={14} />
            Approve Selected
          </button>
          <button
            type="button"
            onClick={() => bulkAction("suspended")}
            disabled={bulkLoading}
            className="flex items-center gap-2 px-4 py-2 rounded border transition-colors"
            style={{
              borderColor: "#C9A84C",
              color: "#C9A84C",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            <PauseCircle size={14} />
            Suspend Selected
          </button>
          <button
            type="button"
            onClick={exportSelectedCsv}
            className="flex items-center gap-2 px-4 py-2 rounded border transition-colors"
            style={{
              borderColor: "var(--gold-primary)",
              color: "#C9A84C",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            <Download size={14} />
            Export Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded overflow-hidden"
        style={{
          background: "#111111",
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <table className="w-full">
          <thead>
            <tr
              className="font-sans text-[9px] uppercase tracking-[2px]"
              style={{
                color: "rgba(250,246,238,0.4)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                borderBottom: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <th className="text-left py-3 px-4 w-12">
                <input
                  type="checkbox"
                  checked={members.length > 0 && selected.size === members.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-2 cursor-pointer accent-[#C9A84C]"
                  style={{ borderColor: "rgba(201,168,76,0.4)" }}
                />
              </th>
              <th className="text-left py-3 px-4">Member</th>
              <th className="text-left py-3 px-4">Membership No.</th>
              <th className="text-left py-3 px-4">Tier</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Applied</th>
              <th className="text-left py-3 px-4 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "rgba(201,168,76,0.06)" }}>
                  <td colSpan={7} className="p-4">
                    <div className="h-10 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
                  </td>
                </tr>
              ))
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center font-sans text-[13px]" style={{ color: "rgba(250,246,238,0.5)" }}>
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b transition-colors hover:bg-[rgba(201,168,76,0.03)]"
                  style={{ borderColor: "rgba(201,168,76,0.06)" }}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => toggleSelect(m.id)}
                      className="w-4 h-4 rounded border-2 cursor-pointer accent-[#C9A84C]"
                      style={{ borderColor: "rgba(201,168,76,0.4)" }}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(201,168,76,0.15)",
                          color: "#C9A84C",
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(m.full_name, m.email)}
                      </div>
                      <div>
                        <p className="font-sans text-[13px]" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                          {m.full_name || "—"}
                        </p>
                        <p className="font-sans text-[11px]" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                          {m.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px]" style={{ color: "rgba(250,246,238,0.5)" }}>
                    {m.membership_number || "—"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-[1px]"
                      style={{
                        backgroundColor: "rgba(201,168,76,0.15)",
                        color: "#C9A84C",
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      {m.membership_tier || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-[1px]"
                      style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        backgroundColor: (STATUS_STYLES[m.membership_status] ?? STATUS_STYLES.pending).bg,
                        color: (STATUS_STYLES[m.membership_status] ?? STATUS_STYLES.pending).color,
                        border: `1px solid ${(STATUS_STYLES[m.membership_status] ?? STATUS_STYLES.pending).border}`,
                      }}
                    >
                      {m.membership_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-sans text-[11px]" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                    {m.applied_at ? new Date(m.applied_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/members/${m.id}`)}
                        className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                        style={{ color: "#C9A84C" }}
                        aria-label="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/members/${m.id}?edit=1`)}
                        className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                        style={{ color: "#C9A84C" }}
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(dropdownOpen === m.id ? null : m.id)}
                          className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                          style={{ color: "#C9A84C" }}
                          aria-label="More"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {dropdownOpen === m.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(null)} aria-hidden />
                            <div
                              className="absolute right-0 top-full mt-1 z-50 py-2 rounded shadow-xl min-w-[140px]"
                              style={{
                                background: "#111",
                                border: "1px solid rgba(201,168,76,0.2)",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => singleAction(m.id, "active")}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left font-sans text-[11px] hover:bg-[rgba(201,168,76,0.08)]"
                                style={{ color: "#22c55e", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => singleAction(m.id, "suspended")}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left font-sans text-[11px] hover:bg-[rgba(201,168,76,0.08)]"
                                style={{ color: "#eab308", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                              >
                                <PauseCircle size={14} /> Suspend
                              </button>
                              <button
                                type="button"
                                onClick={() => singleAction(m.id, "rejected")}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left font-sans text-[11px] hover:bg-[rgba(201,168,76,0.08)]"
                                style={{ color: "#ef4444", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p
          className="font-sans text-[12px]"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {start}-{end} of {total}
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="font-sans text-[11px] uppercase tracking-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * pageSize >= total}
            className="font-sans text-[11px] uppercase tracking-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Next
          </button>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className={inputBase}
            style={{ width: 80 }}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
