"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_BASE = "/ezgif-jpg/ezgif-frame-";
const TOTAL_FRAMES = 240;
const HERO_HEIGHT_VH = 300;
const CACHE_SIZE = 12;
const PRELOAD_COUNT = 8;

function getFramePath(index: number, useHalfFrames: boolean): string {
  const frameNum = useHalfFrames ? Math.min(index * 2 + 1, TOTAL_FRAMES) : index + 1;
  return `${FRAME_BASE}${String(frameNum).padStart(3, "0")}.jpg`;
}

function loadFrame(index: number, useHalfFrames: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = getFramePath(index, useHalfFrames);
  });
}

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const cacheOrderRef = useRef<number[]>([]);
  const [loaded, setLoaded] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const rafRef = useRef<number>();
  const lastFrameRef = useRef(-1);
  const totalToLoadRef = useRef(0);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const totalFrames = isMobile ? Math.ceil(TOTAL_FRAMES / 2) : TOTAL_FRAMES;
    totalToLoadRef.current = totalFrames;

    let loadedCount = 0;
    const toPreload = Math.min(PRELOAD_COUNT, totalFrames);

    function onFrameLoaded() {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / toPreload) * 100));
      if (loadedCount >= toPreload) {
        setLoaded(true);
      }
    }

    const cache = cacheRef.current;
    const order = cacheOrderRef.current;

    for (let i = 0; i < toPreload; i++) {
      loadFrame(i, isMobile).then((img) => {
        cache.set(i, img);
        if (!order.includes(i)) order.push(i);
        onFrameLoaded();
      }).catch(() => onFrameLoaded());
    }

    return () => {
      cache.clear();
      order.length = 0;
    };
  }, []);

  const ensureFrame = (frameIndex: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const totalFrames = isMobile ? Math.ceil(TOTAL_FRAMES / 2) : TOTAL_FRAMES;
    const idx = Math.max(0, Math.min(frameIndex, totalFrames - 1));
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

    loadFrame(idx, isMobile).then((img) => {
      cache.set(idx, img);
      order.push(idx);
    });
    return null;
  };

  useEffect(() => {
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
      const heroHeight = (HERO_HEIGHT_VH / 100) * window.innerHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = heroHeight - viewportHeight;
      const totalFrames = totalToLoadRef.current || 120;

      const scrollY = window.scrollY;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const frameIndex = Math.min(
        Math.floor(scrollProgress * (totalFrames - 1)),
        totalFrames - 1
      );

      for (let d = -2; d <= 2; d++) {
        ensureFrame(frameIndex + d);
      }

      const frame = cacheRef.current.get(frameIndex);
      if (frame && frame.complete && frame.naturalWidth) {
        if (lastFrameRef.current !== frameIndex) {
          lastFrameRef.current = frameIndex;
          const scale = Math.max(canvas.width / frame.naturalWidth, canvas.height / frame.naturalHeight);
          const w = frame.naturalWidth * scale;
          const h = frame.naturalHeight * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.drawImage(frame, x, y, w, h);
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  const [canvasOpacity, setCanvasOpacity] = useState(1);
  useEffect(() => {
    const onScroll = () => {
      const heroHeight = (HERO_HEIGHT_VH / 100) * window.innerHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = heroHeight - viewportHeight;
      const scrollY = window.scrollY;
      if (maxScroll <= 0) {
        setCanvasOpacity(1);
        return;
      }
      const scrollProgress = scrollY / maxScroll;
      if (scrollProgress > 0.97) {
        const exitProgress = (scrollProgress - 0.97) / 0.03;
        setCanvasOpacity(Math.max(0, 1 - exitProgress));
      } else {
        setCanvasOpacity(1);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen object-cover pointer-events-none transition-opacity duration-150"
        style={{ zIndex: 0, opacity: canvasOpacity }}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        aria-hidden
      />
    </>
  );
}
