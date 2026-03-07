"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function ContactBanner() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const section = parallaxRef.current.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const speed = 0.3;
      const offset = -(rect.top * speed);
      setParallaxOffset(offset);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[600px] bg-dark border-y border-gold/20 z-10">
      {/* Parallax image layer — falls back to dark when image not yet added */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full top-[-15%] bg-dark"
        style={{
          height: "130%",
          backgroundImage: "url(/gold-cta.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${parallaxOffset}px)`,
          willChange: "transform",
        }}
      />
      {/* Dark overlay so text remains readable */}
      <div className="absolute inset-0 bg-black/65 z-10" aria-hidden />
      {/* Content */}
      <div className="relative z-20 py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-h2 text-white font-light mb-6">
            Ready to Trade with Confidence?
          </h2>
          <p className="font-sans text-white/85 text-base leading-relaxed mb-10 font-light">
            Whether you are applying for membership, seeking regulatory guidance, or looking to
            connect with verified buyers — the Chamber of Licensed Gold Buyers is your starting
            point.
          </p>
          <Link
            href="/contact"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
