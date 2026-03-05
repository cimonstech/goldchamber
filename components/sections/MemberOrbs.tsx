"use client";

const GOLD = "#C9A84C";
const ORB_COUNT = 8;
const RADIUS = 100;
const ORB_SIZE = 44;
const SIZE = 280;

const PLACEHOLDER_COLORS = [
  "#E8B4BC",
  "#A8D5BA",
  "#F5E6A3",
  "#B8C4E6",
  "#E8D4B8",
  "#C9B8E8",
  "#B8E8E0",
  "#E8C4B8",
];

export function MemberOrbs() {
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Orbit path only - circular track, no spoke lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.5" />
            <stop offset="50%" stopColor={GOLD} stopOpacity="0.9" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS}
          fill="none"
          stroke="url(#orbitGrad)"
          strokeWidth="1.5"
          className="opacity-70"
        />
      </svg>

      {/* Orbs on the orbit - rotating */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "spin 50s linear infinite" }}
      >
        {Array.from({ length: ORB_COUNT }).map((_, i) => {
          const angle = (i / ORB_COUNT) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const rPct = (RADIUS / (SIZE / 2)) * 50;
          const x = 50 + rPct * Math.cos(rad);
          const y = 50 + rPct * Math.sin(rad);
          return (
            <div
              key={i}
              className="absolute rounded-full border-2 overflow-hidden flex items-center justify-center font-sans text-white/80 text-xs font-semibold"
              style={{
                width: ORB_SIZE,
                height: ORB_SIZE,
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length],
                borderColor: GOLD,
                boxShadow: `0 0 12px ${GOLD}40`,
              }}
            >
              <span className="text-dark/80 text-sm font-bold">?</span>
            </div>
          );
        })}
        {/* 500+ orb on the orbit */}
        {(() => {
          const angle = (ORB_COUNT / (ORB_COUNT + 1)) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const rPct = (RADIUS / (SIZE / 2)) * 50;
          const x = 50 + rPct * Math.cos(rad);
          const y = 50 + rPct * Math.sin(rad);
          return (
            <div
              className="absolute rounded-full overflow-hidden flex items-center justify-center font-sans font-bold text-dark border-2"
              style={{
                width: ORB_SIZE,
                height: ORB_SIZE,
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                background: GOLD,
                borderColor: "rgba(255,255,255,0.4)",
                boxShadow: `0 0 16px ${GOLD}`,
                fontSize: 10,
              }}
            >
              500+
            </div>
          );
        })()}
      </div>
    </div>
  );
}
