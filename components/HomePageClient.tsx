"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { HeroContent } from "@/components/hero/HeroContent";
import { Ticker } from "@/components/sections/Ticker";
import { GoldTextReveal } from "@/components/sections/GoldTextReveal";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Membership } from "@/components/sections/Membership";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { ContactBanner } from "@/components/sections/ContactBanner";

const HERO_HEIGHT_VH = 300;
const HeroAnimation = dynamic(
  () => import("@/components/hero/HeroAnimation").then((m) => m.HeroAnimation),
  { ssr: false }
);

export function HomePageClient() {
  const [showTicker, setShowTicker] = useState(false);
  const hasBeenInZoneRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = (HERO_HEIGHT_VH / 100) * window.innerHeight;
      const viewportHeight = window.innerHeight;
      const sectionStart = heroHeight - viewportHeight;
      const scrollY = window.scrollY;

      if (scrollY >= sectionStart && !hasBeenInZoneRef.current) {
        hasBeenInZoneRef.current = true;
        setShowTicker(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className="relative min-h-[300vh]" aria-label="Hero">
        <HeroAnimation />
        <HeroContent />
      </section>
      <GoldTextReveal />
      <TestimonialsSection />
      <div
        className={`transition-opacity ${showTicker ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ transitionDuration: "400ms" }}
      >
        <Ticker />
      </div>
      <About />
      <Services />
      <Membership />
      <WhyChooseUs />
      <NewsPreview />
      <ContactBanner />
    </>
  );
}
