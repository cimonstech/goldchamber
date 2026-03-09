"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_BASE = "/movinggold/ezgif-frame-";
const FRAME_EXT = ".jpg";
const FRAME_PAD = 3;
const FRAME_SCROLL_VH = 300;
const SPLIT_SCROLL_VH = 100;
const ZONE_BUFFER_VH = 80; // extra vh of section after zone ends — space before ticker, overlay never enters ticker
const EARLY_START_VH = 100; // second animation starts this many vh before section (removes blank gap after hero)
const GOLD = "#C9A84C";
const CARD_GLASS_BG = "rgba(250,246,238,0.88)";
const SECTION_BG = "#FAF6EE";
const RULE_COLOR = "rgba(201,168,76,0.15)";
const GOLDBAR_PNG = "/goldbar.png";

const CARD_LABELS = [
  "999.9 PURITY",
  "ETHICALLY SOURCED",
  "GOLDBOD CERTIFIED",
  "BLOCKCHAIN TRACED",
  "GHANAIAN ORIGIN",
  "1KG FINE GOLD",
] as const;

const CARD_DESCRIPTIONS: Record<(typeof CARD_LABELS)[number], string> = {
  "999.9 PURITY":
    "Our gold meets the internationally recognised 999.9 fineness standard — the highest grade of refined gold.",
  "ETHICALLY SOURCED":
    "Every bar certified by CLGB is traceable to its point of origin. We work exclusively with miners who operate within Ghana's legal and environmental framework.",
  "GOLDBOD CERTIFIED":
    "CLGB members operate in full compliance with the Ghana Gold Board. Our certification is recognised by GoldBod as a mark of legitimate, regulated gold trading.",
  "BLOCKCHAIN TRACED":
    "From mine to market, every transaction in the CLGB network is recorded on a transparent digital ledger — giving buyers and regulators verifiable proof of origin.",
  "GHANAIAN ORIGIN":
    "Ghana is one of Africa's foremost gold producers. CLGB exists to ensure that Ghanaian gold reaches the world market with its integrity and provenance fully intact.",
  "1KG FINE GOLD":
    "The standard institutional gold bar weight. CLGB members trade in verified, weighed, and certified quantities — eliminating the risk of short-weighting and fraud.",
};

const iconStyle = { width: 16, height: 16, flexShrink: 0 };

function CardIcon({ index }: { index: number }) {
  const color = GOLD;
  switch (index) {
    case 0: // 999.9 PURITY — diamond
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" style={iconStyle}>
          <path d="M12 2l10 10-10 10L2 12 12 2z" />
        </svg>
      );
    case 1: // ETHICALLY SOURCED — leaf
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
          <path d="M12 22c-4-3-8-6-8-12a8 8 0 0 1 16 0c0 6-4 9-8 12z" />
        </svg>
      );
    case 2: // GOLDBOD CERTIFIED — shield with check
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 3: // BLOCKCHAIN TRACED — chain links
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 4: // GHANAIAN ORIGIN — map pin
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 5: // 1KG FINE GOLD — stack of bars
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
          <rect x="4" y="14" width="16" height="4" rx="1" />
          <rect x="6" y="8" width="12" height="4" rx="1" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}

function getFrameSrc(index: number): string {
  return `${FRAME_BASE}${String(index + 1).padStart(FRAME_PAD, "0")}${FRAME_EXT}`;
}

function loadFrame(index: number, totalFrames: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = getFrameSrc(Math.min(index, totalFrames - 1));
  });
}

type GoldZoomSectionProps = {
  totalFrames: number;
};

export function GoldZoomSection({ totalFrames }: GoldZoomSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [goldbarReady, setGoldbarReady] = useState(false);
  const rafRef = useRef<number>();
  const lastFrameRef = useRef(-1);
  const swapDimensionsRef = useRef<{ width: number; height: number; left: number; top: number } | null>(null);
  const [swapDimensions, setSwapDimensions] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);
  const [openDetailIndex, setOpenDetailIndex] = useState<number | null>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    let loadedCount = 0;
    const total = totalFrames;

    function onOneLoaded() {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / total) * 100));
      if (loadedCount >= total) setLoaded(true);
    }

    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.onload = () => {
        imgs[i] = img;
        onOneLoaded();
      };
      img.onerror = () => onOneLoaded();
      img.src = getFrameSrc(i);
    }
    framesRef.current = imgs;

    return () => {
      framesRef.current = [];
    };
  }, [totalFrames]);

  const [scrollState, setScrollState] = useState({
    frameIndex: 0,
    splitProgress: 0,
    inSplit: false,
    inZone: false,
    reachedLastFrame: false,
  });

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const vh = window.innerHeight;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const earlyStartPx = (EARLY_START_VH / 100) * vh;
      const effectiveStart = sectionTop - earlyStartPx;
      const frameScrollHeight = (FRAME_SCROLL_VH / 100) * vh;
      const splitScrollHeight = (SPLIT_SCROLL_VH / 100) * vh;
      const scrollY = window.scrollY;
      const zoneContentHeightPx = ((FRAME_SCROLL_VH + SPLIT_SCROLL_VH) / 100) * vh;
      const zoneEnd = sectionTop + zoneContentHeightPx;
      const splitStart = effectiveStart + frameScrollHeight;
      const inZone = scrollY >= effectiveStart && scrollY < zoneEnd;
      const inSplit = scrollY >= splitStart;
      const maxFrameScroll = frameScrollHeight - vh;
      const scrollProgress = maxFrameScroll > 0
        ? Math.max(0, Math.min(1, (scrollY - effectiveStart) / maxFrameScroll))
        : 0;
      const frameIndex = Math.min(
        Math.floor(scrollProgress * (totalFrames - 1)),
        totalFrames - 1
      );
      const splitScroll = scrollY - splitStart;
      const splitProgress = inSplit
        ? Math.max(0, Math.min(1, splitScroll / Math.max(1, splitScrollHeight)))
        : 0;
      setScrollState({
        frameIndex,
        splitProgress,
        inSplit,
        inZone,
        reachedLastFrame: frameIndex >= totalFrames - 1,
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalFrames]);

  useEffect(() => {
    if (!loaded || !sectionRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const draw = () => {
      const section = sectionRef.current;
      if (!section) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const earlyStartPx = (EARLY_START_VH / 100) * vh;
      const effectiveStart = sectionTop - earlyStartPx;
      const frameScrollHeight = (FRAME_SCROLL_VH / 100) * vh;
      const maxFrameScroll = frameScrollHeight - vh;
      const inFramePhase = scrollY < effectiveStart + frameScrollHeight;

      let frameIndex = 0;
      if (inFramePhase) {
        const scrollProgress = maxFrameScroll > 0
          ? Math.max(0, Math.min(1, (scrollY - effectiveStart) / maxFrameScroll))
          : 0;
        frameIndex = Math.min(
          Math.floor(scrollProgress * (totalFrames - 1)),
          totalFrames - 1
        );
      }

      const zoneContentHeightPx = ((FRAME_SCROLL_VH + SPLIT_SCROLL_VH) / 100) * vh;
      const zoneEnd = sectionTop + zoneContentHeightPx;
      const inZone = scrollY >= effectiveStart && scrollY < zoneEnd;

      if (!inZone) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const frames = framesRef.current;
      const currentFrame = frames[frameIndex];
      if (!currentFrame?.complete || !currentFrame.naturalWidth) {
        if (frameIndex >= totalFrames - 1 && frames[totalFrames - 1]?.complete && frames[totalFrames - 1].naturalWidth) {
          const lastFrame = frames[totalFrames - 1];
          const cw = canvas.width;
          const ch = canvas.height;
          const scale = Math.max(cw / lastFrame.naturalWidth, ch / lastFrame.naturalHeight);
          const w = lastFrame.naturalWidth * scale;
          const h = lastFrame.naturalHeight * scale;
          const x = (cw - w) / 2;
          const y = (ch - h) / 2;
          if (!swapDimensionsRef.current) {
            swapDimensionsRef.current = { width: w, height: h, left: x, top: y };
            setSwapDimensions(swapDimensionsRef.current);
          }
        }
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.fillStyle = SECTION_BG;
      ctx.fillRect(0, 0, cw, ch);

      lastFrameRef.current = frameIndex;
      const scale = Math.max(cw / currentFrame.naturalWidth, ch / currentFrame.naturalHeight);
      const w = currentFrame.naturalWidth * scale;
      const h = currentFrame.naturalHeight * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;
      ctx.drawImage(currentFrame, x, y, w, h);

      if (frameIndex >= totalFrames - 1 && !swapDimensionsRef.current) {
        swapDimensionsRef.current = { width: w, height: h, left: x, top: y };
        setSwapDimensions(swapDimensionsRef.current);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, totalFrames]);

  const totalHeightVh = FRAME_SCROLL_VH + SPLIT_SCROLL_VH + ZONE_BUFFER_VH;
  const showCanvas = !scrollState.reachedLastFrame || !goldbarReady;
  const showGoldbarImg = scrollState.reachedLastFrame && goldbarReady && !scrollState.inSplit;

  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#FAF6EE]">
          <div className="w-64 h-0.5 bg-[#E8E0D0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%`, backgroundColor: GOLD }}
            />
          </div>
          <p className="font-sans text-sm text-dark/60 uppercase tracking-wider mt-4">
            Loading...
          </p>
        </div>
      )}

      {/* Section: position relative, no gap; canvas and content sit inside this section's scroll range */}
      <div
        ref={sectionRef}
        className="relative m-0 p-0"
        style={{ minHeight: `${totalHeightVh}vh`, background: SECTION_BG }}
        aria-hidden
      />

      {/* Fullscreen canvas: 100vw x 100vh, fixed, z-index 0; hidden by visibility when PNG is shown */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{
          zIndex: 0,
          opacity:
            loaded && showCanvas && scrollState.inZone && !scrollState.inSplit ? 1 : 0,
          visibility:
            loaded && scrollState.inZone && scrollState.reachedLastFrame ? "hidden" : "visible",
          background: SECTION_BG,
        }}
        aria-hidden
      />

      {/* Final frame swap: PNG at exact canvas-drawn dimensions and position; fallback centered if not yet set */}
      {showGoldbarImg && scrollState.inZone && !scrollState.inSplit && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {swapDimensions ? (
            <img
              src={GOLDBAR_PNG}
              alt=""
              width={swapDimensions.width}
              height={swapDimensions.height}
              style={{
                position: "fixed",
                left: swapDimensions.left,
                top: swapDimensions.top,
                width: swapDimensions.width,
                height: swapDimensions.height,
                background: "transparent",
              }}
            />
          ) : (
            <img
              src={GOLDBAR_PNG}
              alt=""
              className="max-w-full max-h-full object-contain"
              style={{ background: "transparent" }}
            />
          )}
        </div>
      )}

      {/* Split phase: z-index 2 — PNG left 50% centred, card right 50% centred, scroll-driven */}
      {scrollState.inZone && scrollState.inSplit && scrollState.reachedLastFrame && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {isMobile ? (
            <div className="flex flex-col h-full w-full">
              <div className="flex-shrink-0 flex items-center justify-center bg-[#050505] w-full flex-1 min-h-0">
                <img
                  src={GOLDBAR_PNG}
                  alt=""
                  className="max-w-full max-h-full object-contain w-full h-full"
                  style={{ background: "transparent" }}
                />
              </div>
              <div
                className="flex-shrink-0 flex flex-col items-center justify-center overflow-auto pointer-events-auto w-full rounded-[5px] relative overflow-visible"
                style={{
                  transform: `translateY(${(1 - scrollState.splitProgress) * 100}%)`,
                  transition: "none",
                  background: CARD_GLASS_BG,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${GOLD}`,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {CARD_LABELS.map((label, i) => (
                    <span
                      key={label}
                      className="font-sans uppercase font-semibold inline-flex items-center gap-1.5"
                      style={{
                        fontSize: 11,
                        letterSpacing: "3px",
                        color: GOLD,
                        fontWeight: 600,
                      }}
                    >
                      <CardIcon index={i} />
                      {label}
                      <button
                        type="button"
                        onClick={() => setOpenDetailIndex((prev) => (prev === i ? null : i))}
                        className="p-0.5 rounded text-gold hover:text-gold-light hover:bg-gold/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        aria-expanded={openDetailIndex === i}
                        aria-label={`View details for ${label}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                {openDetailIndex !== null && (
                  <div
                    className="absolute left-2 right-2 top-full mt-2 z-20 p-3 rounded border shadow-lg"
                    style={{
                      background: CARD_GLASS_BG,
                      borderColor: GOLD,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    <p className="font-sans text-[11px] uppercase font-semibold text-gold tracking-wider mb-1.5">
                      {CARD_LABELS[openDetailIndex]}
                    </p>
                    <p className="font-sans text-dark/80 text-xs leading-relaxed font-light" style={{ margin: 0 }}>
                      {CARD_DESCRIPTIONS[CARD_LABELS[openDetailIndex]]}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpenDetailIndex(null)}
                      className="absolute top-1 right-1 p-0.5 text-gold/70 hover:text-gold rounded"
                      aria-label="Close"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* PNG shifts left to 50% viewport; same pixel dimensions as at swap, no resize */}
              <div
                className="fixed inset-0 overflow-hidden"
                style={{
                  transform:
                    typeof window !== "undefined" && swapDimensions
                      ? "translateX(" +
                        -scrollState.splitProgress *
                          (swapDimensions.left -
                            window.innerWidth * 0.25 +
                            swapDimensions.width / 2) +
                        "px)"
                      : "none",
                  transition: "none",
                }}
              >
                {swapDimensions && (
                  <img
                    src={GOLDBAR_PNG}
                    alt=""
                    width={swapDimensions.width}
                    height={swapDimensions.height}
                    style={{
                      position: "fixed",
                      left: swapDimensions.left,
                      top: swapDimensions.top,
                      width: swapDimensions.width,
                      height: swapDimensions.height,
                      background: "transparent",
                    }}
                  />
                )}
              </div>
              {/* Animated golden lines from gold bar to card */}
              <svg
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <defs>
                  <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
                    <stop offset="50%" stopColor={GOLD} stopOpacity="1" />
                    <stop offset="100%" stopColor={GOLD} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {[0.18, 0.32, 0.46, 0.6, 0.74, 0.88].map((yFrac, i) => (
                  <line
                    key={i}
                    x1="25%"
                    y1={`${yFrac * 100}%`}
                    x2="48%"
                    y2={`${yFrac * 100}%`}
                    stroke="url(#goldLineGrad)"
                    strokeWidth="1"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    style={{
                      animation: `line-draw 1.2s ease-out ${i * 0.1}s forwards`,
                    }}
                  />
                ))}
              </svg>
              <div
                className="fixed top-0 bottom-0 left-1/2 flex items-center justify-center overflow-hidden"
                style={{
                  width: "50%",
                  transform: `translateX(${(1 - scrollState.splitProgress) * 100}%)`,
                  transition: "none",
                }}
              >
                <div className="h-full w-full flex items-center justify-center pointer-events-auto px-6" style={{ transform: "translateX(-56px)" }}>
                  {/* Moving golden glow around card */}
                  <div className="relative w-full max-w-[380px] rounded-[7px]">
                    <div
                      className="absolute rounded-[8px] opacity-90"
                      style={{
                        inset: "-3px",
                        background: `conic-gradient(transparent 0deg, ${GOLD} 90deg, transparent 180deg, ${GOLD} 270deg, transparent 360deg)`,
                        zIndex: -1,
                      }}
                    />
                    <div
                      className="relative w-full max-w-[380px] rounded-[5px] overflow-visible z-0"
                      style={{
                        background: CARD_GLASS_BG,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: `1px solid ${GOLD}`,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      <ul className="space-y-0 list-none p-0 m-0">
                        {CARD_LABELS.map((label, i) => (
                          <li key={label} className="relative">
                            {i > 0 && (
                              <hr
                                className="border-t"
                                style={{
                                  borderColor: RULE_COLOR,
                                  borderWidth: 1,
                                  marginTop: 10,
                                  marginBottom: 10,
                                }}
                              />
                            )}
                            <div
                              className="flex items-center gap-3"
                              style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                margin: 0,
                              }}
                            >
                              <CardIcon index={i} />
                              <p
                                className="flex-1 font-sans uppercase font-semibold min-w-0"
                                style={{
                                  fontSize: 11,
                                  letterSpacing: "3px",
                                  color: GOLD,
                                  fontWeight: 600,
                                  margin: 0,
                                }}
                              >
                                {label}
                              </p>
                              <button
                                type="button"
                                onClick={() => setOpenDetailIndex((prev) => (prev === i ? null : i))}
                                className="flex-shrink-0 p-1 rounded text-gold hover:text-gold-light hover:bg-gold/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                aria-expanded={openDetailIndex === i}
                                aria-label={`View details for ${label}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </button>
                            </div>
                            {openDetailIndex === i && (
                              <div
                                className="absolute left-0 right-0 z-20 mt-1 p-3 rounded shadow-lg border"
                                style={{
                                  background: CARD_GLASS_BG,
                                  borderColor: GOLD,
                                  boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${GOLD}40`,
                                }}
                              >
                                <p className="font-sans text-dark/80 text-xs leading-relaxed font-light" style={{ margin: 0 }}>
                                  {CARD_DESCRIPTIONS[label]}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setOpenDetailIndex(null)}
                                  className="absolute top-1 right-1 p-0.5 text-gold/70 hover:text-gold rounded"
                                  aria-label="Close"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Preload goldbar PNG for seamless swap */}
      <div className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none" aria-hidden>
        <img src={GOLDBAR_PNG} alt="" onLoad={() => setGoldbarReady(true)} />
      </div>
    </>
  );
}
