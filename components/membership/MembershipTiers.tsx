"use client";

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
            "border rounded-sm p-8 flex flex-col transition-colors",
            tier.recommended
              ? "border-gold bg-gold/10 order-first md:order-none shadow-[0_0_0_1px_rgba(201,168,76,0.2)]"
              : "border-gold/25 bg-dark-2/60 hover:border-gold/40"
          )}
        >
          {tier.recommended && (
            <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-gold border border-gold/50 px-3 py-1 mb-4 w-fit">
              Recommended
            </span>
          )}
          <h3 className="font-display text-xl text-white font-semibold mb-6">{tier.name}</h3>
          <ul className="space-y-4 flex-1">
            {tier.benefits.map((b) => (
              <li key={b} className="font-sans text-sm text-white/85 leading-relaxed flex gap-3">
                <span className="text-gold shrink-0 mt-0.5">◆</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
