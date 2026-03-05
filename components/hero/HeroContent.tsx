"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const HERO_HEIGHT_VH = 300;

export function HeroContent() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = (HERO_HEIGHT_VH / 100) * window.innerHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = heroHeight - viewportHeight;
      const scrollY = window.scrollY;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      if (scrollProgress > 0.85) {
        setOpacity(Math.max(0, 1 - (scrollProgress - 0.85) / 0.15));
      } else {
        setOpacity(1);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-4 sm:px-6 z-[2] pointer-events-none"
      style={{ opacity }}
    >
      <div className="pointer-events-auto flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="font-display font-light text-display text-white mb-6">
          Where Trust Shines
          <br />
          <span className="font-semibold text-white">as Bright as Gold.</span>
        </h1>
        <p className="font-sans text-base sm:text-lg text-white/90 max-w-2xl mb-10 leading-relaxed font-light">
          The Chamber of Licensed Gold Buyers — connecting elite traders, ensuring full regulatory
          compliance, and elevating Ghana&apos;s gold industry to a global standard of integrity and
          trust.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/membership"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm"
          >
            Apply for Membership
          </Link>
          <Link
            href="/about"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 border border-white/60 text-white hover:border-gold hover:text-gold transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm"
          >
            Discover Our Mission
          </Link>
        </div>
      </div>
    </div>
  );
}
