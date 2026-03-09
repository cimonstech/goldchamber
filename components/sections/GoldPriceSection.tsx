"use client";

import { useEffect, useState } from "react";

type GoldPriceData = {
  usd: {
    price_24k: number;
    price_22k: number;
    price_21k: number;
    change_percentage: number;
    weight_unit: string;
  };
  ghs?: {
    price_24k: number;
    price_22k: number;
    price_21k: number;
  };
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

export function GoldPriceSection() {
  const [data, setData] = useState<GoldPriceData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/gold-price");
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setData(json);
        setError(false);
      } catch {
        setError(true);
      }
    };
    fetchPrice();
    const id = setInterval(fetchPrice, 60_000);
    return () => clearInterval(id);
  }, []);

  if (error && !data) return null;
  if (!data) {
    return (
      <section className="theme-bg-primary py-12 px-6 md:px-[60px] border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-[800px] mx-auto text-center">
          <p className="font-sans text-xs uppercase tracking-wider animate-pulse" style={{ color: "var(--text-muted)" }}>
            Loading gold prices…
          </p>
        </div>
      </section>
    );
  }

  const { usd, ghs } = data;
  const up = usd.change_percentage >= 0;
  const weightLabel = usd.weight_unit === "gram" ? "per gram" : "per troy oz";

  return (
    <section className="theme-bg-primary py-12 px-6 md:px-[60px] border-b" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="max-w-[800px] mx-auto">
        <p
          className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4 text-center"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Live Gold Prices
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-sans text-sm">
          <span className="uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Gold ({weightLabel})
          </span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            24K: {formatUSD(usd.price_24k)}
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            22K: {formatUSD(usd.price_22k)}
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            21K: {formatUSD(usd.price_21k)}
          </span>
          <span className={up ? "text-emerald-600/90" : "text-red-500/90"}>
            {up ? "↑" : "↓"} {Math.abs(usd.change_percentage).toFixed(2)}%
          </span>
          {ghs && (
            <>
              <span className="w-px h-4 bg-gold/30" aria-hidden />
              <span className="text-gold font-medium">
                GHS 24K: {formatGHS(ghs.price_24k)}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
