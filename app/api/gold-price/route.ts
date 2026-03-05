import { NextResponse } from "next/server";

const APISED_BASE = "https://gold.g.apised.com/v1/latest";

export type GoldPriceResponse = {
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

async function fetchApised(
  apiKey: string,
  baseCurrency: string,
  weightUnit: string
): Promise<{ data?: unknown; ok: boolean; status: number; text?: string }> {
  const url = new URL(APISED_BASE);
  url.searchParams.set("metals", "XAU");
  url.searchParams.set("base_currency", baseCurrency);
  url.searchParams.set("weight_unit", weightUnit);
  const res = await fetch(url.toString(), {
    headers: { "x-api-key": apiKey },
    next: { revalidate: 60 },
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: res.ok, status: res.status, text };
  }
  return { data, ok: res.ok, status: res.status };
}

export async function GET() {
  const apiKey =
    process.env.NEXT_PUBLIC_APISED_SECRET ??
    process.env.APISED_API_KEY ??
    process.env["NEXT_PUBLIC_APISED-SECRET"];

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gold price API key not configured" },
      { status: 503 }
    );
  }

  try {
    const [usdRes, ghsRes] = await Promise.all([
      fetchApised(apiKey, "USD", "toz"),
      fetchApised(apiKey, "GHS", "toz"),
    ]);

    if (!usdRes.ok || !usdRes.data) {
      console.error("APISED gold API error:", usdRes.status, usdRes.text);
      return NextResponse.json(
        { error: "Failed to fetch gold price" },
        { status: 502 }
      );
    }

    const usdJson = usdRes.data as { status?: string; data?: { metal_prices?: { XAU?: Record<string, number> }; weight_unit?: string } };
    if (usdJson.status !== "success" || !usdJson.data?.metal_prices?.XAU) {
      return NextResponse.json(
        { error: "Invalid gold price response" },
        { status: 502 }
      );
    }

    const xau = usdJson.data.metal_prices.XAU;
    const weightUnit = usdJson.data.weight_unit ?? "toz";

    const payload: GoldPriceResponse = {
      usd: {
        price: xau.price ?? 0,
        price_24k: xau.price_24k ?? xau.price ?? 0,
        price_22k: xau.price_22k ?? xau.price ?? 0,
        price_21k: xau.price_21k ?? xau.price ?? 0,
        change: xau.change ?? 0,
        change_percentage: xau.change_percentage ?? 0,
        weight_unit: weightUnit,
      },
      updatedAt: new Date().toISOString(),
    };

    if (ghsRes.ok && ghsRes.data) {
      const ghsJson = ghsRes.data as { status?: string; data?: { metal_prices?: { XAU?: Record<string, number> } } };
      const ghsXau = ghsJson.data?.metal_prices?.XAU;
      if (ghsJson.status === "success" && ghsXau?.price != null) {
        payload.ghs = {
          price: round2(ghsXau.price),
          price_24k: round2(ghsXau.price_24k ?? ghsXau.price),
          price_22k: round2(ghsXau.price_22k ?? ghsXau.price),
          price_21k: round2(ghsXau.price_21k ?? ghsXau.price),
        };
      }
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Gold price API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch gold price" },
      { status: 500 }
    );
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
