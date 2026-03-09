"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Printer, Download, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

type Profile = {
  full_name: string | null;
  membership_tier: string | null;
  membership_status: string;
  membership_number: string | null;
  approved_at: string | null;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Corner ornament SVG — gold flourish */
function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      style={{ color: "var(--gold-primary)" }}
    >
      <path
        d="M0 0 L36 0 L36 6 Q24 12 12 24 L0 36 Z"
        fill="currentColor"
        opacity={0.25}
      />
      <path
        d="M2 2 L28 2 L28 8 Q18 14 10 26 L2 34 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.8}
        opacity={0.6}
      />
    </svg>
  );
}

export default function PortalCertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("full_name, membership_tier, membership_status, membership_number, approved_at")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data as Profile | null);
          setLoading(false);
        }, () => setLoading(false));
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const downloadCertificate = async () => {
    const el = certificateRef.current;
    if (!el || !profile?.membership_number) return;

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-secondary").trim() || "#0a0a0a";
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: bg,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(`CLGB-Certificate-${profile.membership_number}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-[32px]">
        <div className="h-12 w-48 animate-pulse rounded bg-[var(--gold-glow)] mb-8" />
        <div className="h-[500px] animate-pulse rounded bg-[var(--gold-glow)]" />
      </div>
    );
  }

  if (profile?.membership_status !== "active") {
    return (
      <div className="p-[32px]">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Lock size={48} style={{ color: "var(--gold-primary)", marginBottom: 24, opacity: 0.6 }} />
          <h2
            className="font-display font-light mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 28,
              color: "var(--text-primary)",
            }}
          >
            Certificate Not Yet Available
          </h2>
          <p
            className="font-sans text-[13px] mb-8 max-w-md"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Your certificate will be available once your membership application has been approved.
          </p>
          <Link
            href="/portal/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded border transition-colors hover:bg-[var(--gold-glow)]"
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
            Check Application Status
          </Link>
        </div>
      </div>
    );
  }

  const tier = profile?.membership_tier ?? "Member";

  return (
    <div className="p-[32px] certificate-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden; }
              .certificate-container,
              .certificate-container * { visibility: visible; }
              .certificate-container {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: none !important;
                background: #0a0a0a !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .certificate-page-header,
              .no-print { display: none !important; }
            }
          `,
        }}
      />
      <div className="flex items-center justify-between mb-8 no-print certificate-page-header">
        <h1
          className="font-display font-light"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontSize: 28,
            color: "var(--text-primary)",
          }}
        >
          My Certificate
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded border transition-colors hover:bg-[var(--gold-glow)]"
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
            <Printer size={16} />
            Print
          </button>
          <button
            type="button"
            onClick={downloadCertificate}
            className="flex items-center gap-2 px-4 py-2.5 rounded border transition-colors hover:bg-[var(--gold-glow)]"
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
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div
        ref={certificateRef}
        className="certificate-container relative max-w-[800px] mx-auto overflow-hidden"
        data-theme="dark"
        style={{
          aspectRatio: "1.414",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        {/* Gold dust background */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.08 }}>
          <GoldDust particleCount={40} opacity={0.08} />
        </div>

        {/* Outer border */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 12,
            border: "2px solid var(--gold-primary)",
          }}
        />
        {/* Inner border */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 18,
            border: "1px solid var(--border-gold)",
          }}
        />

        {/* Corner ornaments */}
        <div className="absolute top-[18px] left-[18px]">
          <CornerOrnament />
        </div>
        <div className="absolute top-[18px] right-[18px] rotate-90">
          <CornerOrnament />
        </div>
        <div className="absolute bottom-[18px] left-[18px] -rotate-90">
          <CornerOrnament />
        </div>
        <div className="absolute bottom-[18px] right-[18px] rotate-180">
          <CornerOrnament />
        </div>

        {/* Certificate content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 py-16 text-center">
          <p
            className="font-sans text-[11px] uppercase mb-2"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              letterSpacing: "6px",
              color: "var(--gold-primary)",
            }}
          >
            Chamber of Licensed Gold Buyers
          </p>

          <div className="my-6">
            <Image
              src="/primarylogo-white.png"
              alt="CLGB"
              width={80}
              height={24}
              className="block mx-auto"
            />
          </div>

          <p
            className="font-display uppercase mb-8"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 14,
              letterSpacing: "4px",
              color: "var(--text-secondary)",
            }}
          >
            Certificate of Membership
          </p>

          <p
            className="font-display italic mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 18,
              color: "var(--text-secondary)",
            }}
          >
            This is to certify that
          </p>

          <p
            className="font-display font-light mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 52,
              color: "var(--text-primary)",
            }}
          >
            {profile?.full_name ?? "Member"}
          </p>

          <div
            className="w-[60%] h-px mx-auto mb-4"
            style={{ backgroundColor: "var(--gold-primary)" }}
          />

          <p
            className="font-display italic mb-8"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: 20,
              color: "var(--text-secondary)",
            }}
          >
            is a certified {tier} of the Chamber of Licensed Gold Buyers
          </p>

          {/* Two column info row */}
          <div className="flex justify-center gap-16 mb-8 w-full max-w-md">
            <div className="text-left">
              <p
                className="font-sans text-[9px] uppercase tracking-[2px] mb-1"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Membership No.
              </p>
              <p
                className="font-mono text-[14px]"
                style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {profile?.membership_number ?? "—"}
              </p>
            </div>
            <div className="text-left">
              <p
                className="font-sans text-[9px] uppercase tracking-[2px] mb-1"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Valid From
              </p>
              <p
                className="font-sans text-[14px]"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {formatDate(profile?.approved_at ?? null)}
              </p>
            </div>
          </div>

          {/* Bottom row — badges */}
          <p
            className="font-sans text-[9px] uppercase tracking-[3px] mb-10"
            style={{
              color: "var(--gold-primary)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            GoldBod Certified · Ethical Trade · Ghana Minerals Commission Partner
          </p>

          {/* Signatures row */}
          <div className="flex justify-center gap-16 w-full max-w-md">
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-px mb-2"
                style={{ backgroundColor: "var(--gold-glow)" }}
              />
              <p
                className="font-sans text-[9px] uppercase tracking-[2px]"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Founder
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-px mb-2"
                style={{ backgroundColor: "var(--gold-glow)" }}
              />
              <p
                className="font-sans text-[9px] uppercase tracking-[2px]"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Acting CEO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
