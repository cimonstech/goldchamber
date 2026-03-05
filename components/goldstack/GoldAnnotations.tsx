"use client";

import { useState, useEffect } from "react";

const GOLD = "#C9A84C";
const CREAM = "#FAF6EE";
const CREAM_LIGHT = "#F5D06A";
const DARK = "#0F0F0F";


const ANNOTATIONS = [
  { id: 1, label: "999.9 Purity", x: 50, y: 28, desc: "Our gold meets the internationally recognised 999.9 fineness standard — the highest grade of refined gold, accepted by central banks and institutional buyers worldwide." },
  { id: 2, label: "Ethically Sourced", x: 22, y: 62, desc: "Every bar certified by CLGB is traceable to its point of origin. We work exclusively with miners and buyers who operate within Ghana's legal and environmental framework." },
  { id: 3, label: "GoldBod Certified", x: 32, y: 72, desc: "CLGB members operate in full compliance with the Ghana Gold Board. Our certification is recognised by GoldBod as a mark of legitimate, regulated gold trading." },
  { id: 4, label: "Blockchain Traced", x: 74, y: 62, desc: "From mine to market, every transaction in the CLGB network is recorded on a transparent digital ledger — giving buyers and regulators verifiable proof of origin and chain of custody." },
  { id: 5, label: "Ghanaian Origin", x: 50, y: 82, desc: "Ghana is one of Africa's foremost gold producers. CLGB exists to ensure that Ghanaian gold reaches the world market with its integrity, value, and provenance fully intact." },
  { id: 6, label: "1KG Fine Gold", x: 64, y: 32, desc: "The standard institutional gold bar weight. CLGB members trade in verified, weighed, and certified quantities — eliminating the risk of short-weighting and fraud in unregulated markets." },
] as const;

type GoldAnnotationsProps = {
  animationComplete: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onAnnotationClick?: (id: number) => void;
};

export function GoldAnnotations({ animationComplete, containerRef, onAnnotationClick }: GoldAnnotationsProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (!animationComplete) {
      setVisibleCount(0);
      setOpenId(null);
      return;
    }
    if (visibleCount >= ANNOTATIONS.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 200);
    return () => clearTimeout(t);
  }, [animationComplete, visibleCount]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className="absolute inset-0 z-[100] pointer-events-none"
      style={{ pointerEvents: openId ? "auto" : "none" }}
    >
      {ANNOTATIONS.map((point, index) => {
        const isVisible = index < visibleCount;
        const isOpen = openId === point.id;
        // Position dots relative to the centered 63.75% animation box
        const vx = 18.125 + (point.x / 100) * 63.75;
        const vy = 18.125 + (point.y / 100) * 63.75;
        return (
          <div
            key={point.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${vx}%`,
              top: `${vy}%`,
              transform: "translate(-50%, -50%)",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 200ms ease-out",
            }}
          >
            <button
              type="button"
              onClick={() => {
                const next = isOpen ? null : point.id;
                setOpenId(next);
                onAnnotationClick?.(next ?? 0);
              }}
              className="relative flex items-center group cursor-pointer min-w-[48px] min-h-[48px] rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark hover:opacity-90 transition-opacity"
              aria-label={point.label}
            >
              <PulseCircle />
              {!isMobile && (
                <BioLine
                  point={point}
                  isVisible={isVisible}
                  isOpen={isOpen}
                />
              )}
            </button>
          </div>
        );
      })}

      {openId !== null && (
        <>
          <button
            type="button"
            className="absolute inset-0 z-0"
            onClick={() => setOpenId(null)}
            aria-label="Close"
          />
          <AnnotationPanel
            annotation={ANNOTATIONS.find((a) => a.id === openId)!}
            onClose={() => setOpenId(null)}
            isMobile={isMobile}
            containerRef={containerRef}
          />
        </>
      )}
    </div>
  );
}

/** Angled line (obtuse style) + end tick + label; long and close to dot */
const LINE_LENGTH_PX = 220;
const LINE_ANGLE_DEG = 18; // obtuse feel: line angles up from horizontal
const TICK_LEN = 5;

function BioLine({
  point,
  isVisible,
  isOpen,
}: {
  point: (typeof ANNOTATIONS)[number];
  isVisible: boolean;
  isOpen: boolean;
}) {
  const toLeft = point.x < 50;
  const rad = (LINE_ANGLE_DEG * Math.PI) / 180;
  const dy = Math.tan(rad) * 100;
  const x2 = 100;
  const y2 = 50 - dy;
  const pathLen = Math.sqrt(100 * 100 + dy * dy);
  const tickY = toLeft ? 50 : y2;
  const tickX = toLeft ? 0 : 100;
  const vbH = 50 + Math.ceil(Math.abs(dy)) + TICK_LEN;
  return (
    <div
      className="flex items-center flex-shrink-0"
      style={{
        flexDirection: toLeft ? "row-reverse" : "row",
        width: LINE_LENGTH_PX,
        minWidth: 140,
      }}
    >
      <svg
        viewBox={`0 0 100 ${vbH}`}
        className="flex-shrink-0 overflow-visible"
        style={{
          width: LINE_LENGTH_PX,
          minWidth: 140,
          height: (50 * vbH) / 100,
        }}
      >
        <path
          d={toLeft ? `M ${x2} ${y2} L 0 50` : `M 0 50 L ${x2} ${y2}`}
          fill="none"
          stroke={GOLD}
          strokeWidth={0.8}
          strokeDasharray={isVisible ? undefined : pathLen}
          strokeDashoffset={isVisible ? 0 : pathLen}
          style={{ transition: "stroke-dashoffset 0.4s ease-out" }}
        />
        <line
          x1={tickX}
          y1={tickY - TICK_LEN}
          x2={tickX}
          y2={tickY + TICK_LEN}
          stroke={GOLD}
          strokeWidth={0.8}
          opacity={isVisible ? 1 : 0}
          style={{ transition: "opacity 0.25s ease-out" }}
        />
      </svg>
      <span
        className="font-sans uppercase tracking-[0.2em] text-[10px] transition-colors flex-shrink-0"
        style={{
          color: isOpen ? CREAM_LIGHT : CREAM,
          letterSpacing: "2px",
          marginLeft: toLeft ? 0 : 8,
          marginRight: toLeft ? 8 : 0,
          textAlign: toLeft ? "right" : "left",
        }}
      >
        {point.label}
      </span>
    </div>
  );
}

function PulseCircle() {
  const size = 23;
  const inner = 14;
  return (
    <span
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute rounded-full animate-ping-sonar"
        style={{
          width: inner,
          height: inner,
          backgroundColor: GOLD,
          opacity: 0.5,
        }}
      />
      <span
        className="relative rounded-full"
        style={{
          width: inner,
          height: inner,
          backgroundColor: GOLD,
        }}
      />
    </span>
  );
}

function AnnotationPanel({
  annotation,
  onClose,
  isMobile,
  containerRef,
}: {
  annotation: (typeof ANNOTATIONS)[number];
  onClose: () => void;
  isMobile: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isLeft = annotation.x < 50;

  if (isMobile) {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl animate-slide-up"
        style={{
          background: DARK,
          borderTop: `1px solid ${GOLD}`,
          boxShadow: "0 -8px 32px rgba(201, 168, 76, 0.15)",
        }}
      >
        <div className="p-6 pb-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[10px] text-[#888] hover:text-cream"
          >
            ✕
          </button>
          <p className="font-sans text-[11px] uppercase text-gold font-semibold tracking-wider mb-2">
            {annotation.label}
          </p>
          <p
            className="font-sans text-[13px] font-light leading-[1.8]"
            style={{ color: "rgba(250,246,238,0.75)" }}
          >
            {annotation.desc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute z-50 w-72 max-w-[90vw] rounded animate-fade-in"
      style={{
        left: isLeft ? "55%" : undefined,
        right: isLeft ? undefined : "55%",
        top: "50%",
        transform: "translateY(-50%)",
        background: DARK,
        borderTop: `1px solid ${GOLD}`,
        boxShadow: "0 8px 32px rgba(201, 168, 76, 0.15)",
      }}
    >
      <div className="p-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-[10px] text-[#888] hover:text-cream"
        >
          ✕
        </button>
        <p className="font-sans text-[11px] uppercase font-semibold tracking-wider mb-2 pr-6" style={{ color: GOLD }}>
          {annotation.label}
        </p>
        <p
          className="font-sans text-[13px] font-light leading-[1.8]"
          style={{ color: "rgba(250,246,238,0.75)" }}
        >
          {annotation.desc}
        </p>
      </div>
    </div>
  );
}
