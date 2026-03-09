"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Application = {
  id: string;
  full_name: string;
  email: string;
  submitted_at: string;
  membership_tier: string;
  gold_activity: string | null;
  status: string;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  reviewing: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

type Tab = "pending" | "reviewing" | "resolved";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pending");
  const [applications, setApplications] = useState<Application[]>([]);
  const [counts, setCounts] = useState({ pending: 0, reviewing: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchCounts() {
      const [p, r, a, rej] = await Promise.all([
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "reviewing"),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      ]);
      setCounts({
        pending: p.count ?? 0,
        reviewing: r.count ?? 0,
        resolved: (a.count ?? 0) + (rej.count ?? 0),
      });
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    setLoading(true);
    let q = supabase
      .from("applications")
      .select("id, full_name, email, submitted_at, membership_tier, gold_activity, status")
      .order("submitted_at", { ascending: false });

    if (tab === "pending") q = q.eq("status", "pending");
    else if (tab === "reviewing") q = q.eq("status", "reviewing");
    else q = q.in("status", ["approved", "rejected"]);

    q.then(({ data }) => {
      setApplications((data ?? []) as Application[]);
      setLoading(false);
    });
  }, [tab]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "reviewing", label: "Reviewing", count: counts.reviewing },
    { key: "resolved", label: "Resolved", count: counts.resolved },
  ];

  return (
    <div className="p-[32px]">
      <h1
        className="font-display font-light mb-8"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 28,
          color: "#FAF6EE",
        }}
      >
        Applications
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "font-sans text-[10px] uppercase tracking-[2px] py-2 px-5 border cursor-pointer transition-all duration-200 flex items-center gap-2",
              tab === t.key
                ? "bg-[#C9A84C] text-[#050505] border-[#C9A84C] font-bold"
                : "bg-transparent text-[rgba(250,246,238,0.5)] border-[rgba(201,168,76,0.3)]"
            )}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {t.label}
            {t.key === "pending" && t.count > 0 && (
              <span
                className="min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "rgba(5,5,5,0.2)", color: "#050505" }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Application cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded"
              style={{ background: "rgba(250,246,238,0.08)" }}
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <p
          className="font-sans text-[14px]"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          No applications in this category.
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/admin/applications/${app.id}`)}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/admin/applications/${app.id}`)}
              className="flex flex-wrap items-center justify-between gap-4 p-6 rounded cursor-pointer transition-colors hover:bg-[rgba(201,168,76,0.03)]"
              style={{
                background: "#111111",
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className="font-display font-light"
                  style={{
                    fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                    fontSize: 22,
                    color: "#FAF6EE",
                  }}
                >
                  {app.full_name}
                </p>
                <p
                  className="font-sans text-[12px] mt-0.5"
                  style={{
                    color: "rgba(250,246,238,0.5)",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {app.email}
                </p>
                <p
                  className="font-sans text-[11px] mt-1"
                  style={{
                    color: "rgba(250,246,238,0.4)",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  Submitted {new Date(app.submitted_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="inline-block px-2.5 py-1 rounded font-sans text-[9px] uppercase"
                  style={{
                    backgroundColor: "rgba(201,168,76,0.15)",
                    color: "#C9A84C",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {app.membership_tier}
                </span>
                {app.gold_activity && (
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[9px]"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.08)",
                      color: "rgba(250,246,238,0.6)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {app.gold_activity}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
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
                <span
                  className="font-sans text-[11px] uppercase tracking-[2px]"
                  style={{ color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Review →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
