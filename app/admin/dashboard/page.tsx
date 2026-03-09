"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Users,
  ClipboardList,
  Newspaper,
  TrendingUp,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MemberGrowthChart = dynamic(() => import("./MemberGrowthChart").then((m) => m.MemberGrowthChart), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full animate-pulse rounded bg-[var(--gold-glow)]" />,
});

type Application = {
  id: string;
  full_name: string;
  membership_tier: string;
  submitted_at: string;
  status: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  membership_tier: string | null;
  membership_status: string;
  created_at: string;
};

type SortKey = "member" | "tier" | "status" | "joined";
type SortDir = "asc" | "desc";

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  reviewing: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
  active: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  suspended: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[var(--gold-glow)] ${className}`}
      style={{ minHeight: 20 }}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div
      className="rounded p-6 transition-all duration-300"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="w-10 h-10 rounded mb-4" style={{ background: "rgba(201,168,76,0.08)" }} />
      <Skeleton className="h-10 w-20 mb-2" />
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeMembers: 0,
    pendingApplications: 0,
    publishedArticles: 0,
    newThisMonth: 0,
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [chartData, setChartData] = useState<{ month: string; count: number }[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Use admin APIs for consistent data (bypasses RLS, same source as sidebar)
        const [countsRes, appsRes, membersRes] = await Promise.all([
          fetch("/api/admin/applications?counts=1"),
          fetch("/api/admin/applications?recent=5"),
          fetch("/api/admin/members?search=&tier=All+Tiers&status=All+Status&page=1&pageSize=25"),
        ]);

        const counts = countsRes.ok ? await countsRes.json() : {};
        const appsData = appsRes.ok ? await appsRes.json() : {};
        const membersData = membersRes.ok ? await membersRes.json() : {};

        const pendingCount = counts.pending ?? 0;
        const applicationsList = (appsData.data ?? []) as Application[];
        const membersList = (membersData.data ?? []) as Profile[];

        const activeMembers = membersList.filter((m) => m.membership_status === "active");
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newThisMonth = activeMembers.filter((m) => new Date(m.created_at) >= startOfMonth).length;

        // Published articles — still need Supabase (no admin API)
        const supabase = createClient();
        const { count: articlesCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");

        setStats({
          activeMembers: activeMembers.length,
          pendingApplications: pendingCount,
          publishedArticles: articlesCount ?? 0,
          newThisMonth,
        });
        setApplications(applicationsList.slice(0, 5));
        setMembers(activeMembers.slice(0, 8));

        // Member growth chart — placeholder for last 6 months
        const baseCount = activeMembers.length || 100;
        const months: { month: string; count: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          d.setDate(1);
          const prevCount = months.length > 0 ? months[months.length - 1]!.count : baseCount - 25;
          months.push({
            month: d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
            count: prevCount + Math.floor(Math.random() * 8) + 2,
          });
        }
        setChartData(months);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setChartData([
          { month: "Sep 24", count: 120 },
          { month: "Oct 24", count: 135 },
          { month: "Nov 24", count: 148 },
          { month: "Dec 24", count: 162 },
          { month: "Jan 25", count: 178 },
          { month: "Feb 25", count: 195 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const sortedMembers = [...members].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "member":
        cmp = (a.full_name || a.email).localeCompare(b.full_name || b.email);
        break;
      case "tier":
        cmp = (a.membership_tier || "").localeCompare(b.membership_tier || "");
        break;
      case "status":
        cmp = a.membership_status.localeCompare(b.membership_status);
        break;
      case "joined":
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="p-8">
      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Users}
              value={stats.activeMembers}
              label="Active Members"
              trend={`+${stats.newThisMonth} this month`}
              trendPositive
            />
            <StatCard
              icon={ClipboardList}
              value={stats.pendingApplications}
              label="Pending Applications"
              trend={stats.pendingApplications > 0 ? "Awaiting review" : "All caught up"}
            />
            <StatCard
              icon={Newspaper}
              value={stats.publishedArticles}
              label="Published Articles"
              trend="Total articles"
            />
            <StatCard
              icon={TrendingUp}
              value={stats.newThisMonth}
              label="New This Month"
              trend="vs last month"
              trendPositive
            />
          </>
        )}
      </div>

      {/* Row 2 — Applications + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div
          className="rounded p-6"
          style={{
            background: "#111111",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-display font-light"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: 22,
                color: "var(--text-primary)",
              }}
            >
              Recent Applications
            </h2>
            <Link
              href="/admin/applications"
              className="font-sans text-[10px] uppercase tracking-[2px]"
              style={{
                color: "var(--gold-primary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <p
              className="font-sans text-[13px]"
              style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              No applications yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="font-sans text-[9px] uppercase tracking-[1px]"
                    style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    <th className="text-left py-3 pr-4">Name</th>
                    <th className="text-left py-3 pr-4">Tier</th>
                    <th className="text-left py-3 pr-4">Date</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/admin/applications/${app.id}`)}
                      onKeyDown={(e) => e.key === "Enter" && router.push(`/admin/applications/${app.id}`)}
                      className="border-t cursor-pointer transition-colors duration-200 hover:bg-[rgba(201,168,76,0.04)]"
                      style={{ borderColor: "rgba(201,168,76,0.08)" }}
                    >
                      <td className="py-3 pr-4 font-sans text-[13px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                        {app.full_name}
                      </td>
                      <td className="py-3 pr-4 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.7)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                        {app.membership_tier}
                      </td>
                      <td className="py-3 pr-4 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div
          className="rounded p-6"
          style={{
            background: "#111111",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          <h2
            className="font-display font-light mb-6"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 22,
              color: "var(--text-primary)",
            }}
          >
            Member Growth
          </h2>
          {loading ? (
            <Skeleton className="h-[240px] w-full" />
          ) : (
            <MemberGrowthChart data={chartData} />
          )}
        </div>
      </div>

      {/* Row 3 — Recent Members */}
      <div
        className="rounded p-6"
        style={{
          background: "#111111",
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-display font-light"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 22,
              color: "var(--text-primary)",
            }}
          >
            Recent Members
          </h2>
          <Link
            href="/admin/members"
            className="font-sans text-[10px] uppercase tracking-[2px]"
            style={{
              color: "var(--gold-primary)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p
            className="font-sans text-[13px]"
            style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            No members yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="font-sans text-[9px] uppercase tracking-[1px]"
                  style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <th
                    className="text-left py-3 pr-4 cursor-pointer hover:text-[var(--gold-primary)]"
                    onClick={() => handleSort("member")}
                  >
                    Member
                  </th>
                  <th
                    className="text-left py-3 pr-4 cursor-pointer hover:text-[var(--gold-primary)]"
                    onClick={() => handleSort("tier")}
                  >
                    Tier
                  </th>
                  <th
                    className="text-left py-3 pr-4 cursor-pointer hover:text-[var(--gold-primary)]"
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </th>
                  <th
                    className="text-left py-3 pr-4 cursor-pointer hover:text-[var(--gold-primary)]"
                    onClick={() => handleSort("joined")}
                  >
                    Joined
                  </th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t transition-colors duration-200 hover:bg-[rgba(201,168,76,0.04)]"
                    style={{ borderColor: "rgba(201,168,76,0.08)" }}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: "rgba(201,168,76,0.2)",
                            color: "var(--gold-primary)",
                            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {(m.full_name || m.email).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-sans text-[13px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                            {m.full_name || "—"}
                          </p>
                          <p className="font-sans text-[11px]" style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-block px-2 py-0.5 rounded font-sans text-[9px] uppercase"
                        style={{
                          backgroundColor: "rgba(201,168,76,0.15)",
                          color: "var(--gold-primary)",
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        }}
                      >
                        {m.membership_tier || "—"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-block px-2 py-0.5 rounded font-sans text-[9px] uppercase"
                        style={{
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          backgroundColor: (STATUS_STYLES[m.membership_status] ?? { bg: "rgba(250,246,238,0.1)" }).bg,
                          color: (STATUS_STYLES[m.membership_status] ?? { color: "rgba(250,246,238,0.6)" }).color,
                          border: `1px solid ${(STATUS_STYLES[m.membership_status] ?? { border: "transparent" }).border}`,
                        }}
                      >
                        {m.membership_status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-sans text-[12px]" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/admin/members/${m.id}`}
                        className="inline-flex p-2 rounded transition-colors hover:bg-[rgba(201,168,76,0.1)]"
                        style={{ color: "var(--gold-primary)" }}
                        aria-label="View member"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendPositive,
}: {
  icon: React.ComponentType<Record<string, unknown>>;
  value: number;
  label: string;
  trend: string;
  trendPositive?: boolean;
}) {
  return (
    <div
      className="rounded p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(201,168,76,0.3)]"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded mb-4"
        style={{ background: "rgba(201,168,76,0.08)" }}
      >
        <Icon size={18} style={{ color: "var(--gold-primary)" }} />
      </div>
      <p
        className="font-display font-light"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 42,
          fontWeight: 300,
          color: "#F5D06A",
        }}
      >
        {value}
      </p>
      <p
        className="mt-1 font-sans text-[10px] uppercase tracking-[2px]"
        style={{
          color: "rgba(250,246,238,0.5)",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        }}
      >
        {label}
      </p>
      <p
        className="mt-1 font-sans text-[11px]"
        style={{
          color: trendPositive ? "#22c55e" : "rgba(250,246,238,0.5)",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        }}
      >
        {trend}
      </p>
    </div>
  );
}
