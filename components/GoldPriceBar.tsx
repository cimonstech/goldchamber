"use client";

import { useEffect, useState } from "react";

type GoldPriceData = {
  usd: {
    price: number;
    price_24k: number;
    price_22k: number;
    price_21k: number;
    change: number;
    change_percentage: number;
    weight_unit: string;
  };
  ghs?: {
    price: number;
    price_24k: number;
    price_22k: number;
    price_21k: number;
  };
  updatedAt: string;
};

const POLL_INTERVAL_MS = 60_000;

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

export function GoldPriceBar() {
  const [data, setData] = useState<GoldPriceData | null>(null);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (error && !data) {
    return (
      <div className="border-b py-2" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs uppercase tracking-wider text-center" style={{ color: "var(--text-muted)" }}>
            Live gold prices temporarily unavailable
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border-b py-2" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs uppercase tracking-wider text-center animate-pulse" style={{ color: "var(--text-muted)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  const { usd, ghs } = data;
  const up = usd.change >= 0;

  return (
    <div className="border-b py-2.5" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-sans text-xs">
          <span className="uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Gold (per {usd.weight_unit === "gram" ? "gram" : "troy oz"})
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
          <span
            className={
              up ? "text-emerald-600/90" : "text-red-500/90"
            }
          >
            {up ? "↑" : "↓"} {Math.abs(usd.change_percentage).toFixed(2)}%
          </span>
          {ghs && (
            <>
              <span className="text-gold/80 w-px h-3 bg-gold/30" aria-hidden />
              <span className="text-gold font-medium">
                GHS 24K: {formatGHS(ghs.price_24k)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
