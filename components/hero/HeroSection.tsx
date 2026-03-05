"use client";

import dynamic from "next/dynamic";
import { HeroContent } from "@/components/hero/HeroContent";

const HeroAnimation = dynamic(
  () => import("@/components/hero/HeroAnimation").then((m) => m.HeroAnimation),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section className="relative min-h-[300vh]" aria-label="Hero">
      <HeroAnimation />
      <HeroContent />
    </section>
  );
}
