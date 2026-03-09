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
    <section className="ticker-section relative z-10 border-y py-3 overflow-hidden" style={{ borderColor: "var(--border-gold)" }}>
      <div className="flex animate-ticker whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="ticker-item mx-8 font-sans text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>
            <span className="text-gold">◆</span> {item} <span className="text-gold">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
