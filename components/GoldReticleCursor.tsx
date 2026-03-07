"use client";

import { useEffect, useState } from "react";

export interface GoldReticleCursorProps {
  isActive: boolean;
}

export function GoldReticleCursor({ isActive }: GoldReticleCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    document.body.style.cursor = isActive ? "none" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isActive, isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] transition-opacity duration-200 ease-out"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        opacity: isActive ? 1 : 0,
      }}
      aria-hidden
    >
      <svg width="32" height="32" viewBox="0 0 32 32" className="block">
        {/* Outer circle — rotates */}
        <g style={{ transformOrigin: "16px 16px" }} className="animate-reticle-spin">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#C9A84C"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        </g>
        {/* Inner circle */}
        <circle
          cx="16"
          cy="16"
          r="3"
          stroke="#F5D06A"
          strokeWidth="1"
          fill="none"
        />
        {/* Centre dot */}
        <circle cx="16" cy="16" r="1" fill="#F5D06A" />
        {/* Cross lines — top */}
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="9"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Cross lines — bottom */}
        <line
          x1="16"
          y1="23"
          x2="16"
          y2="30"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Cross lines — left */}
        <line
          x1="2"
          y1="16"
          x2="9"
          y2="16"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Cross lines — right */}
        <line
          x1="23"
          y1="16"
          x2="30"
          y2="16"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Corner ticks — top left */}
        <path
          d="M6 10 L6 6 L10 6"
          stroke="#F5D06A"
          strokeWidth="1"
          fill="none"
        />
        {/* Corner ticks — top right */}
        <path
          d="M22 6 L26 6 L26 10"
          stroke="#F5D06A"
          strokeWidth="1"
          fill="none"
        />
        {/* Corner ticks — bottom left */}
        <path
          d="M6 22 L6 26 L10 26"
          stroke="#F5D06A"
          strokeWidth="1"
          fill="none"
        />
        {/* Corner ticks — bottom right */}
        <path
          d="M22 26 L26 26 L26 22"
          stroke="#F5D06A"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}
