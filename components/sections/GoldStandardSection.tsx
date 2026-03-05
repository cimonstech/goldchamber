"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { GoldAnnotations } from "@/components/goldstack/GoldAnnotations";

const GoldStackAnimation = dynamic(
  () => import("@/components/goldstack/GoldStackAnimation").then((m) => m.GoldStackAnimation),
  { ssr: false }
);

const DEFAULT_TOTAL_FRAMES = 240;
const SECTION_HEIGHT_VH = 300;
const BUFFER_VH = 150;

export function GoldStandardSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [stillInZone, setStillInZone] = useState(true);
  const [scrollProgressReachedEnd, setScrollProgressReachedEnd] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionEnd = sectionTop + sectionHeight;
      const zoneEnd = sectionEnd + (BUFFER_VH / 100) * viewportHeight;
      const scrollY = window.scrollY;
      setStillInZone(scrollY < zoneEnd);
      const maxScroll = sectionHeight - viewportHeight;
      const progress = maxScroll > 0 ? Math.min(1, (scrollY - sectionTop) / maxScroll) : 0;
      setScrollProgressReachedEnd(progress >= 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showOverlay = stillInZone && (animationComplete || scrollProgressReachedEnd);

  return (
    <>
      {/* Tall block so the second animation is scroll-driven (like the first). Pops up right after hero. */}
      <div
        ref={sectionRef}
        className="relative"
        style={{ minHeight: `${SECTION_HEIGHT_VH}vh` }}
        aria-hidden
      />

      {/* Fixed canvas: large and centered, driven by scroll position. High z-index so it stays above content. */}
      <GoldStackAnimation
        totalFrames={DEFAULT_TOTAL_FRAMES}
        framePath="/ezgif/ezgif-frame-"
        frameExtension="jpg"
        frameNumberPadding={3}
        sectionRef={sectionRef}
        bufferVh={BUFFER_VH}
        onAnimationComplete={() => setAnimationComplete(true)}
        onReset={() => setAnimationComplete(false)}
      />

      {/* Annotations only visible while still in section + buffer; high z-index */}
      {showOverlay && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute inset-0 pointer-events-auto">
            <GoldAnnotations
              animationComplete={true}
              containerRef={sectionRef}
            />
          </div>
        </div>
      )}
    </>
  );
}
