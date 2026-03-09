"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type GoldPriceResponse = {
  usd?: { price_24k?: number };
  ghs?: { price_24k?: number };
  updatedAt?: string;
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  published_at: string;
};

type Ticket = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
};

type Profile = {
  full_name: string | null;
  email: string;
  membership_tier: string | null;
  membership_status: string;
  membership_number: string | null;
  approved_at: string | null;
  created_at: string;
};

const TIER_BENEFITS: Record<string, string[]> = {
  Associate: [
    "CLGB Certification",
    "GoldBod Network Access",
    "Regulatory Guidance",
    "Member Newsletter",
  ],
  "Full Member": [
    "Elite Buyer Network Access",
    "Real-Time Market Intelligence",
    "Legal & Financial Support",
    "Training & Capacity Building",
  ],
  Corporate: [
    "Dedicated Account Manager",
    "Custom Compliance Framework",
    "Institutional GoldBod Partnerships",
    "Board-Level Representation",
  ],
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  active: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  suspended: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
  open: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  in_progress: { bg: "rgba(234,179,8,0.15)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
  resolved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
  closed: { bg: "rgba(250,246,238,0.15)", color: "rgba(250,246,238,0.6)", border: "rgba(250,246,238,0.2)" },
};

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function getDaysSince(dateStr: string | null): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function excerpt(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

function getFirstName(fullName: string | null): string {
  if (!fullName?.trim()) return "Member";
  const parts = fullName.trim().split(/\s+/);
  return parts[0] ?? "Member";
}

function OdometerCounter({ value, visible }: { value: number; visible: boolean }) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = Date.now();
    const duration = 1500;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, visible]);

  return <span>{display}</span>;
}

export default function PortalDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [priceData, setPriceData] = useState<GoldPriceResponse | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [countVisible, setCountVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("full_name, email, membership_tier, membership_status, membership_number, approved_at, created_at")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data as Profile);
        });
    });
  }, []);

  useEffect(() => {
    if (!profile?.membership_tier) return;
    const supabase = createClient();
    supabase
      .from("announcements")
      .select("id, title, body, published_at")
      .contains("tier_visibility", [profile.membership_tier])
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setAnnouncements((data ?? []) as Announcement[]));
  }, [profile?.membership_tier]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("support_tickets")
        .select("id, subject, status, created_at")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)
        .then(({ data }) => setTickets((data ?? []) as Ticket[]));
    });
  }, []);

  const fetchPrice = async () => {
    try {
      const res = await fetch("/api/gold-price");
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      setPriceData(json);
    } catch {
      setPriceData(null);
    }
  };

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setCountVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const usd24k = priceData?.usd?.price_24k;
  const ghs24k = priceData?.ghs?.price_24k;
  const ghs22k = ghs24k != null ? ghs24k * 0.9167 : null;
  const ghs21k = ghs24k != null ? ghs24k * 0.875 : null;

  const joinDate = profile?.approved_at ?? profile?.created_at ?? null;
  const daysAsMember = getDaysSince(joinDate);
  const tier = profile?.membership_tier ?? "Associate";
  const benefits = TIER_BENEFITS[tier] ?? TIER_BENEFITS.Associate;

  const cardStyle = {
    background: "var(--bg-tertiary)",
    border: "1px solid rgba(201,168,76,0.12)",
  };

  return (
    <div ref={sectionRef} className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 36,
          color: "var(--text-primary)",
        }}
      >
        Welcome back, {getFirstName(profile?.full_name ?? null)}
      </h1>

      {/* ROW 1 — Three stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 — Membership Status */}
        <div className="p-6 rounded" style={cardStyle}>
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-3"
            style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Membership Status
          </p>
          <span
            className="inline-block px-4 py-1.5 rounded-full font-sans text-[10px] uppercase tracking-[1px] mb-4"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              backgroundColor: (STATUS_STYLES[profile?.membership_status ?? "pending"] ?? STATUS_STYLES.pending).bg,
              color: (STATUS_STYLES[profile?.membership_status ?? "pending"] ?? STATUS_STYLES.pending).color,
              border: `1px solid ${(STATUS_STYLES[profile?.membership_status ?? "pending"] ?? STATUS_STYLES.pending).border}`,
            }}
          >
            {profile?.membership_status ?? "pending"}
          </span>
          <p
            className="font-sans text-[12px] mb-1"
            style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Tier: {profile?.membership_tier ?? "—"}
          </p>
          <p
            className="font-mono text-[13px] mb-2"
            style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {profile?.membership_number ?? "—"}
          </p>
          <p
            className="font-sans text-[10px]"
            style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Active since {joinDate ? formatDate(joinDate) : "—"}
          </p>
        </div>

        {/* Card 2 — Days as Member */}
        <div className="p-6 rounded" style={cardStyle}>
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-3"
            style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Days as Member
          </p>
          <div
            className="font-display font-semibold text-[42px] mb-2"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              color: "var(--gold-primary)",
            }}
          >
            <OdometerCounter value={daysAsMember} visible={countVisible} />
          </div>
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-2"
            style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Days as Member
          </p>
          <p
            className="font-sans text-[10px]"
            style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Joined {joinDate ? formatDate(joinDate) : "—"}
          </p>
        </div>

        {/* Card 3 — Tier Benefits */}
        <div className="p-6 rounded" style={cardStyle}>
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-3"
            style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Tier Benefits
          </p>
          <ul className="space-y-2 mb-4">
            {benefits.map((item, i) => (
              <li key={i} className="flex gap-2 items-start">
                <CheckCircle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--gold-primary)" }} />
                <span
                  className="font-sans text-[12px]"
                  style={{ color: "rgba(250,246,238,0.8)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/membership"
            className="font-sans text-[11px] uppercase tracking-[2px]"
            style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            View All Benefits →
          </Link>
        </div>
      </div>

      {/* ROW 2 — Gold price + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left — Live Gold Price */}
        <div className="p-6 rounded" style={cardStyle}>
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-4"
            style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Live Gold Price
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-sans text-[9px] uppercase mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>24K USD</p>
              <p className="font-display font-medium text-[22px]" style={{ color: "#F5D06A", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                {usd24k != null ? formatUSD(usd24k) : "---"}
              </p>
            </div>
            <div>
              <p className="font-sans text-[9px] uppercase mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>24K GHS</p>
              <p className="font-display font-medium text-[22px]" style={{ color: "#F5D06A", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                {ghs24k != null ? formatGHS(ghs24k) : "---"}
              </p>
            </div>
            <div>
              <p className="font-sans text-[9px] uppercase mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>22K GHS</p>
              <p className="font-display font-medium text-[22px]" style={{ color: "#F5D06A", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                {ghs22k != null ? formatGHS(ghs22k) : "---"}
              </p>
            </div>
            <div>
              <p className="font-sans text-[9px] uppercase mb-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>21K GHS</p>
              <p className="font-display font-medium text-[22px]" style={{ color: "#F5D06A", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                {ghs21k != null ? formatGHS(ghs21k) : "---"}
              </p>
            </div>
          </div>
          <Link
            href="/portal/prices"
            className="font-sans text-[11px] uppercase tracking-[2px]"
            style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            View Price History →
          </Link>
        </div>

        {/* Right — Latest Announcements */}
        <div className="p-6 rounded" style={cardStyle}>
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-4"
            style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Latest Announcements
          </p>
          {announcements.length === 0 ? (
            <p
              className="font-sans text-[13px]"
              style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              No announcements for your tier.
            </p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.id}>
                  <p
                    className="font-display font-medium"
                    style={{
                      fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                      fontSize: 18,
                      color: "var(--text-primary)",
                    }}
                  >
                    {a.title}
                  </p>
                  <p
                    className="font-sans text-[10px] mt-0.5"
                    style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {formatDate(a.published_at)}
                  </p>
                  <p
                    className="font-sans text-[10px] mt-1 line-clamp-2"
                    style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {excerpt(a.body, 120)}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link
            href="/portal/news"
            className="inline-block mt-4 font-sans text-[11px] uppercase tracking-[2px]"
            style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            View All →
          </Link>
        </div>
      </div>

      {/* ROW 3 — Support Tickets */}
      <div className="p-6 rounded" style={cardStyle}>
        <p
          className="font-sans text-[9px] uppercase tracking-[3px] mb-4"
          style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Support Tickets
        </p>
        {tickets.length === 0 ? (
          <p
            className="font-sans text-[13px] mb-4"
            style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            No tickets yet.
          </p>
        ) : (
          <div className="space-y-3 mb-4">
            {tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                <p
                  className="font-sans text-[13px]"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {t.subject}
                </p>
                <span
                  className="inline-block px-2.5 py-1 rounded-full font-sans text-[9px] uppercase"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    backgroundColor: (STATUS_STYLES[t.status] ?? STATUS_STYLES.open).bg,
                    color: (STATUS_STYLES[t.status] ?? STATUS_STYLES.open).color,
                    border: `1px solid ${(STATUS_STYLES[t.status] ?? STATUS_STYLES.open).border}`,
                  }}
                >
                  {t.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <Link
            href="/portal/support"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded border transition-colors hover:bg-[var(--gold-glow)]"
            style={{
              borderColor: "var(--gold-primary)",
              color: "var(--gold-primary)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Open New Ticket →
          </Link>
          <Link
            href="/portal/support"
            className="font-sans text-[11px] uppercase tracking-[2px]"
            style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            View All Tickets →
          </Link>
        </div>
      </div>
    </div>
  );
}
