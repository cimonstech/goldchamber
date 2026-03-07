"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Shield, Globe, TrendingUp, Users, BarChart2, Award } from "lucide-react";
import { GoldReticleCursor } from "@/components/GoldReticleCursor";

const GOLD_GRADIENT =
  "linear-gradient(135deg, #8B6914 0%, #F5D06A 40%, #C9A84C 70%, #F5D06A 100%)";

const CARD_STYLE = {
  background: "rgba(201, 168, 76, 0.08)",
  border: "1px solid rgba(201, 168, 76, 0.25)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow:
    "0 8px 32px rgba(201, 168, 76, 0.12), inset 0 1px 0 rgba(201, 168, 76, 0.15)",
  borderRadius: 16,
  minWidth: 180,
} as const;

const CHART_DATA = [42, 38, 45, 41, 48, 44, 52, 49, 56, 53, 58, 61];
const CHART_HEIGHT = 40;

type GoldPriceResponse = {
  ghs?: { price_24k?: number };
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function GoldTextReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  const [isReticleActive, setIsReticleActive] = useState(false);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/gold-price");
        const data: GoldPriceResponse = await res.json();
        const price = data.ghs?.price_24k;
        if (typeof price === "number") setGoldPrice(price);
      } catch {
        setGoldPrice(null);
      }
    };
    fetchPrice();
    intervalRef.current = setInterval(fetchPrice, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;
        setSectionVisible(true);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionVisible) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 2000, 1);
      const eased = easeOut(progress);
      setMemberCount(Math.floor(eased * 500));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [sectionVisible]);

  const minVal = Math.min(...CHART_DATA);
  const maxVal = Math.max(...CHART_DATA);
  const range = maxVal - minVal || 1;
  const points = CHART_DATA.map((v, i) => {
    const x = (i / (CHART_DATA.length - 1)) * 100;
    const y = CHART_HEIGHT - ((v - minVal) / range) * CHART_HEIGHT;
    return [x, y] as const;
  });
  const pathD = `M ${points.map(([x, y]) => `${x},${y}`).join(" L ")}`;
  const fillPathD = `M 0,${CHART_HEIGHT} L ${points.map(([x, y]) => `${x},${y}`).join(" L ")} L 100,${CHART_HEIGHT} Z`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] bg-dark overflow-hidden"
      style={{ marginTop: "-30vh" }}
      aria-label="Ghana's Gold. The World's Standard."
      onMouseEnter={() => setIsReticleActive(true)}
      onMouseLeave={() => setIsReticleActive(false)}
    >
      <GoldReticleCursor isActive={isReticleActive} />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-mobile {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes rollUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .gold-float-1 { animation: float 3.5s ease-in-out 0s infinite; }
          .gold-float-2 { animation: float 4s ease-in-out 0.8s infinite; }
          .gold-float-3 { animation: float 3.2s ease-in-out 1.4s infinite; }
          @media (max-width: 767px) {
            .gold-float-1 { animation: float-mobile 3.5s ease-in-out 0s infinite; }
            .gold-float-2 { animation: float-mobile 4s ease-in-out 0.8s infinite; }
            .gold-float-3 { animation: float-mobile 3.2s ease-in-out 1.4s infinite; }
          }
          .gold-card-1 { left: 4%; top: 50%; transform: translateY(-50%) rotate(-3deg); }
          .gold-card-2 { right: 4%; top: 35%; transform: rotate(4deg); }
          .gold-card-3-desktop { top: auto; bottom: -80px; left: 50%; transform: translateX(-50%) rotate(-2deg); }
          @media (max-width: 767px) {
            .gold-card-1 { top: 15%; transform: translateY(0) rotate(-1.5deg); }
            .gold-card-2 { top: 15%; transform: rotate(2deg); }
          }
        `,
      }} />
      <div className="min-h-[100vh] flex flex-col items-center justify-center px-6 py-16">
        <div
          className="relative w-full max-w-[1400px] mx-auto md:pb-[180px]"
          style={{ margin: "0 auto" }}
        >
          {/* Text block — IntersectionObserver fade-up */}
          <div
            className="flex flex-col items-center justify-center text-center transition-none"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateY(0)" : "translateY(20px)",
              transition: sectionVisible ? "opacity 800ms ease, transform 800ms ease" : "none",
            }}
          >
            <div
              className="text-[clamp(24px,3.5vw,48px)]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
                background: GOLD_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <div className="mb-1 md:mb-2">Ghana&apos;s Gold.</div>
              <div>The World&apos;s Standard.</div>
            </div>
            <p
              className="mt-4 max-w-[520px] text-center"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(11px, 1.2vw, 14px)",
                color: "rgba(250,246,238,0.55)",
                letterSpacing: "1px",
              }}
            >
              Ghana&apos;s foremost chamber of certified gold trading professionals — trusted by miners, buyers, and institutions.
            </p>
            {/* Icons row */}
            <div
              className="flex items-center justify-center gap-5 my-4"
              style={{ margin: "16px 0" }}
            >
              <div className="flex flex-col items-center">
                <Shield size={16} style={{ color: "rgba(201,168,76,0.6)" }} />
                <span className="mt-1 font-sans text-[8px] uppercase tracking-[2px]" style={{ color: "rgba(250,246,238,0.4)" }}>Certified</span>
              </div>
              <div className="flex flex-col items-center">
                <Globe size={16} style={{ color: "rgba(201,168,76,0.6)" }} />
                <span className="mt-1 font-sans text-[8px] uppercase tracking-[2px]" style={{ color: "rgba(250,246,238,0.4)" }}>Global Standard</span>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp size={16} style={{ color: "rgba(201,168,76,0.6)" }} />
                <span className="mt-1 font-sans text-[8px] uppercase tracking-[2px]" style={{ color: "rgba(250,246,238,0.4)" }}>Live Market</span>
              </div>
            </div>
            <Link
              href="/membership"
              className="relative z-[20] font-sans text-[10px] font-bold uppercase tracking-[3px] py-3.5 px-9 rounded-sm cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)] inline-block"
              style={{
                marginTop: 28,
                marginBottom: 40,
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                color: "#050505",
                border: "none",
                pointerEvents: "auto",
              }}
            >
              Apply for Membership
            </Link>

            {/* Card 3 — mobile: static, in flow after button */}
            <div className="md:hidden pointer-events-none" style={{ marginTop: 32 }}>
              {sectionVisible && (
                <div className="gold-float-3 will-change-transform scale-[0.85] p-4 px-5" style={CARD_STYLE}>
                  <Award size={14} className="absolute top-3 left-3" style={{ color: "rgba(201,168,76,0.7)" }} />
                  <div className="flex items-center gap-4 pl-6">
                    <div className="relative shrink-0">
                      <svg width="44" height="44" className="-rotate-90">
                        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                        <circle cx="22" cy="22" r="20" fill="none" stroke="#C9A84C" strokeWidth="2" strokeDasharray={`${2 * Math.PI * 20 * 0.999} ${2 * Math.PI * 20}`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(201,168,76,0.6))" }} />
                      </svg>
                    </div>
                    <div>
                      <Odometer9999 visible={sectionVisible} />
                      <div className="h-px my-2" style={{ background: "rgba(201,168,76,0.2)" }} />
                      <div className="font-sans text-[9px] uppercase tracking-[3px]" style={{ color: "rgba(250,246,238,0.6)" }}>FINENESS STANDARD</div>
                      <div className="font-sans text-[8px] uppercase tracking-[2px] mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>LONDON GOOD DELIVERY</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cards 1 & 2 — absolute */}
          {sectionVisible && (
            <>
              <div className="absolute gold-card-1 pointer-events-none">
                <div className="gold-float-1 will-change-transform scale-[0.85] md:scale-100 p-4 px-5 md:py-6 md:px-7" style={CARD_STYLE}>
                  <Users size={14} className="absolute top-3 left-3" style={{ color: "rgba(201,168,76,0.7)" }} />
                  <div className="absolute top-3 right-3 w-3 h-3" style={{ background: "#F5D06A", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                  <div className="font-display font-semibold text-[28px] md:text-[42px] text-[#F5D06A] pl-6" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                    {memberCount}{memberCount >= 500 ? "+" : ""}
                  </div>
                  <div className="h-px my-2" style={{ background: "rgba(201,168,76,0.2)" }} />
                  <div className="font-sans text-[9px] uppercase tracking-[3px]" style={{ color: "rgba(250,246,238,0.6)" }}>ACTIVE MEMBERS</div>
                  <div className="font-sans text-[8px] uppercase tracking-[2px] mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>CLGB CERTIFIED</div>
                </div>
              </div>
              <div className="absolute gold-card-2 pointer-events-none">
                <div className="gold-float-2 will-change-transform scale-[0.85] md:scale-100 p-4 px-5 md:py-6 md:px-7" style={CARD_STYLE}>
                  <BarChart2 size={14} className="absolute top-3 left-3" style={{ color: "rgba(201,168,76,0.7)" }} />
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ boxShadow: "0 0 6px #4ade80", animation: "pulse-dot 2s ease-in-out infinite" }} />
                  <div className="font-display font-semibold text-[28px] md:text-[42px] text-[#F5D06A] pl-6" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                    {goldPrice != null ? `GHS ${goldPrice.toLocaleString("en-GH", { minimumFractionDigits: 2 })}` : "---"}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <MiniLineChart visible={sectionVisible} pathD={pathD} fillPathD={fillPathD} />
                  </div>
                  <div className="h-px my-2" style={{ background: "rgba(201,168,76,0.2)" }} />
                  <div className="font-sans text-[9px] uppercase tracking-[3px]" style={{ color: "rgba(250,246,238,0.6)" }}>GOLD · 24K</div>
                  <div className="font-sans text-[8px] uppercase tracking-[2px] mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>PER TROY OZ</div>
                </div>
              </div>
              {/* Card 3 — desktop: absolute below button */}
              <div className="absolute gold-card-3-desktop pointer-events-none hidden md:block">
                <div className="gold-float-3 will-change-transform scale-[0.85] md:scale-100 p-4 px-5 md:py-6 md:px-7" style={CARD_STYLE}>
                  <Award size={14} className="absolute top-3 left-3" style={{ color: "rgba(201,168,76,0.7)" }} />
                  <div className="flex items-center gap-4 pl-6">
                    <div className="relative shrink-0">
                      <svg width="44" height="44" className="-rotate-90">
                        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                        <circle cx="22" cy="22" r="20" fill="none" stroke="#C9A84C" strokeWidth="2" strokeDasharray={`${2 * Math.PI * 20 * 0.999} ${2 * Math.PI * 20}`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(201,168,76,0.6))" }} />
                      </svg>
                    </div>
                    <div>
                      <Odometer9999 visible={sectionVisible} />
                      <div className="h-px my-2" style={{ background: "rgba(201,168,76,0.2)" }} />
                      <div className="font-sans text-[9px] uppercase tracking-[3px]" style={{ color: "rgba(250,246,238,0.6)" }}>FINENESS STANDARD</div>
                      <div className="font-sans text-[8px] uppercase tracking-[2px] mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>LONDON GOOD DELIVERY</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Odometer9999({ visible }: { visible: boolean }) {
  const digits = ["9", "9", "9", ".", "9"];
  return (
    <div className="font-display font-semibold text-[28px] md:text-[42px] text-[#F5D06A] flex items-baseline" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
      {digits.map((d, i) =>
        d === "." ? (
          <span key={i} style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease 400ms" }}>.</span>
        ) : (
          <span key={i} className="inline-block overflow-hidden" style={{ height: "1em", lineHeight: 1 }}>
            <span
              className="block"
              style={{
                animation: visible ? `rollUp 600ms ease-out ${i * 120}ms forwards` : "none",
                opacity: 0,
                transform: "translateY(100%)",
              }}
            >
              {d}
            </span>
          </span>
        )
      )}
    </div>
  );
}

function MiniLineChart({ visible, pathD, fillPathD }: { visible: boolean; pathD: string; fillPathD: string }) {
  const minVal = Math.min(...CHART_DATA);
  const maxVal = Math.max(...CHART_DATA);
  const range = maxVal - minVal || 1;
  const lastY = CHART_HEIGHT - ((CHART_DATA[CHART_DATA.length - 1]! - minVal) / range) * CHART_HEIGHT;
  return (
    <div className="w-full relative" style={{ height: CHART_HEIGHT }}>
      <svg viewBox={`0 0 100 ${CHART_HEIGHT}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(201,168,76,0.15)" />
            <stop offset="1" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d={fillPathD} fill="url(#chartFill)" stroke="none" opacity={visible ? 1 : 0} style={{ transition: "opacity 1500ms ease-in-out" }} />
        <path d={pathD} fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={visible ? 0 : 100} style={{ transition: "stroke-dashoffset 1500ms ease-in-out" }} />
      </svg>
      <div
        className="absolute rounded-full bg-[#F5D06A]"
        style={{
          right: 0,
          top: lastY - 2,
          width: 4,
          height: 4,
          animation: visible ? "pulse-dot 2s ease-in-out infinite" : "none",
        }}
      />
    </div>
  );
}
