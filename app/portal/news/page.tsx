"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Announcement = {
  id: string;
  title: string;
  body: string;
  published_at: string;
};

const cardStyle = {
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncateLines(text: string, lines: number): string {
  const arr = text.split("\n").filter(Boolean);
  const slice = arr.slice(0, lines).join("\n");
  return arr.length > lines ? slice + "…" : slice;
}

export default function PortalNewsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setProfile] = useState<{ membership_tier: string | null } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("membership_tier")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data as { membership_tier: string | null } | null);
          const tier = (data as { membership_tier?: string } | null)?.membership_tier;
          if (!tier) {
            setLoading(false);
            return;
          }
          supabase
            .from("announcements")
            .select("id, title, body, published_at")
            .contains("tier_visibility", [tier])
            .order("published_at", { ascending: false })
            .then(({ data: ann }) => {
              setAnnouncements((ann ?? []) as Announcement[]);
              setLoading(false);
            }, () => setLoading(false));
        }, () => setLoading(false));
    });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-12 w-48 animate-pulse rounded bg-[rgba(250,246,238,0.08)] mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        Announcements
      </h1>

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p
            className="font-display font-light max-w-md"
            style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "var(--text-primary)" }}
          >
            No announcements at this time. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => {
            const isExpanded = expandedId === a.id;
            return (
              <div
                key={a.id}
                className="p-6 rounded transition-all duration-300 hover:border-[var(--border-gold-strong)]"
                style={cardStyle}
              >
                <h2
                  className="font-display font-light mb-2"
                  style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 22, color: "var(--text-primary)" }}
                >
                  {a.title}
                </h2>
                <p
                  className="font-sans text-[10px] mb-4"
                  style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {formatDate(a.published_at)}
                </p>
                <p
                  className="font-sans text-[14px] leading-relaxed whitespace-pre-wrap"
                  style={{ color: "rgba(250,246,238,0.7)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {isExpanded ? a.body : truncateLines(a.body, 3)}
                </p>
                {a.body.split("\n").filter(Boolean).length > 3 && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : a.id)}
                    className="mt-4 font-sans text-[11px] uppercase tracking-[2px]"
                    style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
