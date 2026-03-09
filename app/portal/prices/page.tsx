"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

type GoldPriceResponse = {
  usd?: { price_24k?: number };
  ghs?: { price_24k?: number };
  updatedAt?: string;
};

// TODO: Replace with real historical price API when available
function generatePlaceholderHistory(days: number): { date: string; price: number }[] {
  const data: { date: string; price: number }[] = [];
  const base = 18500;
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const variance = (Math.random() - 0.5) * 800;
    data.push({
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      price: Math.round(base + variance + (i * 10)),
    });
  }
  return data;
}

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

const RANGE_OPTIONS = [
  { key: 7, label: "7 days" },
  { key: 30, label: "30 days" },
  { key: 90, label: "90 days" },
];

export default function PortalPricesPage() {
  const [priceData, setPriceData] = useState<GoldPriceResponse | null>(null);
  const [rangeDays, setRangeDays] = useState(30);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);

  useEffect(() => {
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
    fetchPrice();
    const id = setInterval(fetchPrice, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setChartData(generatePlaceholderHistory(rangeDays));
  }, [rangeDays]);

  const usd24k = priceData?.usd?.price_24k;
  const ghs24k = priceData?.ghs?.price_24k;
  const ghs22k = ghs24k != null ? ghs24k * 0.9167 : null;
  const ghs21k = ghs24k != null ? ghs24k * 0.875 : null;

  const cardStyle = { background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" };

  return (
    <div className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        Gold Prices
      </h1>

      {/* Price cards — larger and more prominent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded" style={cardStyle}>
          <p className="font-sans text-[9px] uppercase tracking-[3px] mb-2" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>24K GOLD · USD</p>
          <p className="font-display font-medium text-[32px] text-[#F5D06A]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
            {usd24k != null ? formatUSD(usd24k) : "---"}
          </p>
          <p className="font-sans text-[10px] mt-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>per troy oz</p>
        </div>
        <div className="p-6 rounded" style={cardStyle}>
          <p className="font-sans text-[9px] uppercase tracking-[3px] mb-2" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>24K GOLD · GHS</p>
          <p className="font-display font-medium text-[32px] text-[#F5D06A]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
            {ghs24k != null ? formatGHS(ghs24k) : "---"}
          </p>
          <p className="font-sans text-[10px] mt-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>per troy oz</p>
        </div>
        <div className="p-6 rounded" style={cardStyle}>
          <p className="font-sans text-[9px] uppercase tracking-[3px] mb-2" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>22K GOLD · GHS</p>
          <p className="font-display font-medium text-[32px] text-[#F5D06A]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
            {ghs22k != null ? formatGHS(ghs22k) : "---"}
          </p>
          <p className="font-sans text-[10px] mt-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>91.67% purity</p>
        </div>
        <div className="p-6 rounded" style={cardStyle}>
          <p className="font-sans text-[9px] uppercase tracking-[3px] mb-2" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>21K GOLD · GHS</p>
          <p className="font-display font-medium text-[32px] text-[#F5D06A]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
            {ghs21k != null ? formatGHS(ghs21k) : "---"}
          </p>
          <p className="font-sans text-[10px] mt-1" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>87.5% purity</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded mb-6" style={cardStyle}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2
            className="font-display font-medium"
            style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}
          >
            Price History
          </h2>
          <div className="flex gap-2">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRangeDays(r.key)}
                className={cn(
                  "font-sans text-[10px] uppercase tracking-[2px] py-2 px-4 rounded border transition-all",
                  rangeDays === r.key ? "bg-[var(--gold-primary)] text-[var(--bg-primary)] border-[var(--gold-primary)] font-bold" : "bg-transparent text-[var(--text-muted)] border-[var(--input-border)]"
                )}
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(250,246,238,0.5)", fontSize: 10, fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                axisLine={{ stroke: "rgba(201,168,76,0.2)" }}
                tickLine={{ stroke: "rgba(201,168,76,0.2)" }}
              />
              <YAxis
                tick={{ fill: "rgba(250,246,238,0.5)", fontSize: 10, fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                axisLine={{ stroke: "rgba(201,168,76,0.2)" }}
                tickLine={{ stroke: "rgba(201,168,76,0.2)" }}
                tickFormatter={(v) => `GHS ${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 4,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--gold-primary)" }}
                formatter={(value) => [formatGHS(Number(value ?? 0)), "Price"]}
              />
              <Line type="monotone" dataKey="price" stroke="var(--gold-primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p
        className="font-sans text-[11px]"
        style={{ color: "rgba(250,246,238,0.3)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        Gold prices are indicative and sourced from international market data. CLGB does not guarantee pricing accuracy.
      </p>
    </div>
  );
}
