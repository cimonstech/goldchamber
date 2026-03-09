"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  recommended: boolean;
  benefits: string[];
};

export function MembershipTiers({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "border rounded-sm p-6 sm:p-8 flex flex-col transition-colors",
            tier.recommended
              ? "border-gold order-first md:order-none"
              : "hover:border-gold/40"
          )}
          style={{
            ...(tier.recommended
              ? { borderColor: "var(--gold-primary)", backgroundColor: "var(--bg-card)", boxShadow: "0 0 0 1px var(--input-border)" }
              : { borderColor: "var(--border-gold)", backgroundColor: "var(--bg-card-solid)" }
            ),
          }}
        >
          {tier.recommended && (
            <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-gold border border-gold/50 px-3 py-1 mb-4 w-fit">
              Recommended
            </span>
          )}
          <h3 className="font-display text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>{tier.name}</h3>
          <ul className="space-y-4 flex-1">
            {tier.benefits.map((b) => (
              <li key={b} className="font-sans text-sm leading-relaxed flex gap-3" style={{ color: "var(--text-secondary)" }}>
                <span className="text-gold shrink-0 mt-0.5">◆</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            href="#membership-form"
            className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3 border-2 border-gold text-gold hover:bg-gold transition-all duration-300 text-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 min-h-[44px] flex items-center justify-center"
          >
            Apply for {tier.name.split(" ")[0]}
          </Link>
        </div>
      ))}
    </div>
  );
}
