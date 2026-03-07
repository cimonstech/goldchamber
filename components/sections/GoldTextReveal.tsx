"use client";

// Overlap with hero fade (0.97) to eliminate blank gap; extends to 1.5
const ZONE_START = 0.97;
const ZONE_END = 1.5;
const ZONE_LENGTH = ZONE_END - ZONE_START;

const GOLD_GRADIENT =
  "linear-gradient(135deg, #8B6914 0%, #F5D06A 40%, #C9A84C 70%, #F5D06A 100%)";

type GoldTextRevealProps = {
  scrollProgress: number;
};

export function GoldTextReveal({ scrollProgress }: GoldTextRevealProps) {
  const inBand = scrollProgress >= ZONE_START && scrollProgress <= ZONE_END;

  if (!inBand) return null;

  const bandProgress = (scrollProgress - ZONE_START) / ZONE_LENGTH;
  // Phase 1 (0–1.0): left to centre over full band (half speed). Phase 2: locked at centre.
  const translateX =
    bandProgress < 1 ? -100 + bandProgress * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-none bg-dark"
      aria-label="Ghana's Gold. The World's Standard."
    >
      <div
        className="flex flex-col items-center justify-center text-center px-6 md:text-[clamp(48px,7vw,96px)] text-[clamp(32px,8vw,56px)]"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
          background: GOLD_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          transform: `translateX(${translateX}vw)`,
          willChange: "transform",
        }}
      >
        <div className="mb-2 md:mb-3">Ghana&apos;s Gold.</div>
        <div>The World&apos;s Standard.</div>
      </div>
    </div>
  );
}
