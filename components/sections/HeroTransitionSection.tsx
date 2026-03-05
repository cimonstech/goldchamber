"use client";

import { useEffect, useState } from "react";

type GoldPriceData = {
  usd?: { price_24k: number; price_22k: number; price_21k: number; change_percentage: number };
  ghs?: { price_24k: number };
};

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export function HeroTransitionSection() {
  const [price, setPrice] = useState<GoldPriceData | null>(null);

  useEffect(() => {
    fetch("/api/gold-price")
      .then((r) => r.ok ? r.json() : null)
      .then(setPrice)
      .catch(() => setPrice(null));
  }, []);

  const points: number[] = price?.usd
    ? [
        price.usd.price_24k * 0.98,
        price.usd.price_24k * 0.99,
        price.usd.price_24k * 1.002,
        price.usd.price_24k * 0.997,
        price.usd.price_24k,
      ]
    : [2600, 2620, 2610, 2650, 2680];

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 800;
  const h = 320;
  const padding = { top: 24, right: 24, bottom: 32, left: 56 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const pathD = points
    .map((v, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((v - min) / range) * chartH;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const areaD = `${pathD} L ${padding.left + chartW} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden pb-32">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201, 168, 76, 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 animate-gold-zoom-in">
        <div className="border border-gold/30 bg-dark-2/90 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gold/20 flex flex-wrap items-center justify-between gap-4">
            <span className="font-sans text-xs uppercase tracking-wider text-gold/80">XAU/USD · Spot</span>
            {price?.usd && (
              <span className="font-sans text-sm text-cream">
                24K {formatUSD(price.usd.price_24k)}
                {price.ghs && (
                  <span className="text-gold/90 ml-3">GHS {formatGHS(price.ghs.price_24k)}</span>
                )}
              </span>
            )}
          </div>
          <div className="relative" style={{ width: "100%", maxWidth: w, margin: "0 auto" }}>
            <svg
              viewBox={`0 0 ${w} ${h}`}
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              <defs>
                <linearGradient id="goldChartGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgba(201, 168, 76, 0.15)" />
                  <stop offset="100%" stopColor="rgba(201, 168, 76, 0)" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#goldChartGrad)" />
              <path
                d={pathD}
                fill="none"
                stroke="rgba(201, 168, 76, 0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((v, i) => {
                const x = padding.left + (i / (points.length - 1)) * chartW;
                const y = padding.top + chartH - ((v - min) / range) * chartH;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#C9A84C"
                    className="opacity-90"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
