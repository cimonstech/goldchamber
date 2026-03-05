"use client";

import { useEffect, useRef, useState } from "react";

const SECTION_HEIGHT_VH = 300;
const CACHE_SIZE = 12;
const PRELOAD_COUNT = 8;

type GoldStackAnimationProps = {
  totalFrames: number;
  framePath?: string;
  frameExtension?: string;
  frameNumberPadding?: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  bufferVh?: number;
  onAnimationComplete?: () => void;
  onReset?: () => void;
};

function getFrameSrc(
  index: number,
  totalFrames: number,
  framePath: string,
  frameExtension: string,
  padding: number,
  useHalfFrames: boolean
): string {
  const frameNum = useHalfFrames ? index * 2 + 1 : index + 1;
  const num = Math.min(frameNum, totalFrames);
  return `${framePath}${String(num).padStart(padding, "0")}.${frameExtension}`;
}

function loadFrame(
  index: number,
  totalFrames: number,
  framePath: string,
  frameExtension: string,
  padding: number,
  useHalfFrames: boolean
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = getFrameSrc(index, totalFrames, framePath, frameExtension, padding, useHalfFrames);
  });
}

export function GoldStackAnimation({
  totalFrames,
  framePath = "/ezgif/ezgif-frame-",
  frameExtension = "jpg",
  frameNumberPadding = 3,
  sectionRef,
  bufferVh = 150,
  onAnimationComplete,
  onReset,
}: GoldStackAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const cacheOrderRef = useRef<number[]>([]);
  const rafRef = useRef<number>();
  const lastFrameRef = useRef(-1);
  const lastCompleteRef = useRef(false);
  const canvasOpacityRef = useRef(1);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveTotal = isMobile ? Math.ceil(totalFrames / 2) : totalFrames;

  useEffect(() => {
    let loadedCount = 0;
    const toPreload = Math.min(PRELOAD_COUNT, effectiveTotal);
    const useHalf = isMobile;

    for (let i = 0; i < toPreload; i++) {
      loadFrame(i, totalFrames, framePath, frameExtension, frameNumberPadding, useHalf)
        .then((img) => {
          cacheRef.current.set(i, img);
          cacheOrderRef.current.push(i);
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / toPreload) * 100));
          if (loadedCount >= toPreload) setFramesLoaded(true);
        })
        .catch(() => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / toPreload) * 100));
          if (loadedCount >= toPreload) setFramesLoaded(true);
        });
    }
    return () => {
      cacheRef.current.clear();
      cacheOrderRef.current = [];
    };
  }, [effectiveTotal, totalFrames, framePath, frameExtension, frameNumberPadding, isMobile]);

  const ensureFrame = (frameIndex: number) => {
    const idx = Math.max(0, Math.min(frameIndex, effectiveTotal - 1));
    const cache = cacheRef.current;
    const order = cacheOrderRef.current;
    if (cache.has(idx)) {
      order.splice(order.indexOf(idx), 1);
      order.push(idx);
      return cache.get(idx)!;
    }
    if (cache.size >= CACHE_SIZE && order.length > 0) {
      const evict = order.shift()!;
      cache.delete(evict);
    }
    loadFrame(idx, totalFrames, framePath, frameExtension, frameNumberPadding, isMobile).then(
      (img) => {
        cache.set(idx, img);
        order.push(idx);
      }
    );
    return null;
  };

  useEffect(() => {
    if (!framesLoaded || !sectionRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const el = wrapperRef.current;
      const w = el ? el.clientWidth : window.innerWidth;
      const h = el ? el.clientHeight : window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    setSize();
    window.addEventListener("resize", setSize);
    const ro = new ResizeObserver(setSize);
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    const draw = () => {
      const section = sectionRef.current;
      if (!section) return;

      const viewportHeight = window.innerHeight;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const maxScroll = sectionHeight - viewportHeight;
      const scrollY = window.scrollY;

      if (maxScroll <= 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const inSection = scrollY >= sectionTop;
      const bufferPx = (bufferVh / 100) * viewportHeight;
      const zoneEnd = sectionTop + sectionHeight + bufferPx;
      const fadeStart = zoneEnd - viewportHeight * 0.25;
      let opacity = 1;
      if (!inSection) {
        opacity = 0;
      } else if (scrollY > fadeStart) {
        opacity = Math.max(0, 1 - (scrollY - fadeStart) / (viewportHeight * 0.25));
      }
      canvasOpacityRef.current = opacity;
      if (framesLoaded) canvas.style.opacity = String(opacity);

      const scrollProgress = Math.max(0, Math.min(1, (scrollY - sectionTop) / maxScroll));
      const frameIndex = Math.min(
        Math.floor(scrollProgress * (effectiveTotal - 1)),
        effectiveTotal - 1
      );

      if (scrollProgress >= 1 && !lastCompleteRef.current) {
        lastCompleteRef.current = true;
        onAnimationComplete?.();
      }
      if (scrollProgress < 1) lastCompleteRef.current = false;

      for (let d = -2; d <= 2; d++) ensureFrame(frameIndex + d);
      const frame = cacheRef.current.get(frameIndex);

      if (frame && frame.complete && frame.naturalWidth) {
        if (lastFrameRef.current !== frameIndex) {
          lastFrameRef.current = frameIndex;
          const scale = Math.max(
            canvas.width / frame.naturalWidth,
            canvas.height / frame.naturalHeight
          );
          const w = frame.naturalWidth * scale;
          const h = frame.naturalHeight * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.fillStyle = "#050505";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(frame, x, y, w, h);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [framesLoaded, sectionRef, effectiveTotal, bufferVh, onAnimationComplete]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) onReset?.();
      },
      { threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef, onReset]);

  return (
    <>
      {!framesLoaded && (
        <div className="fixed inset-0 z-[40] flex flex-col items-center justify-center bg-[#050505]">
          <div className="w-64 h-0.5 bg-dark-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%`, backgroundColor: "#C9A84C" }}
            />
          </div>
          <p className="font-sans text-sm text-cream/70 uppercase tracking-wider mt-4">
            Loading...
          </p>
        </div>
      )}
      <div className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none">
        <div
          ref={wrapperRef}
          className="w-[63.75%] h-[63.75%] flex items-center justify-center transition-opacity duration-150"
          style={{ opacity: framesLoaded ? 1 : 0 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            width={800}
            height={600}
            aria-hidden
          />
        </div>
      </div>
    </>
  );
}
