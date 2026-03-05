"use client";

const items = [
  "GoldBod Certified",
  "500+ Licensed Members",
  "Ethical Sourcing Guaranteed",
  "Ghana Minerals Commission Partner",
  "Blockchain-Powered Traceability",
  "Fair & Transparent Pricing",
];

export function Ticker() {
  return (
    <section className="relative z-10 bg-dark-2 border-y border-gold/30 py-3 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <span className="text-gold">◆</span> {item} <span className="text-gold">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
