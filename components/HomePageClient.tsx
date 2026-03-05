"use client";

import dynamic from "next/dynamic";
import { HeroContent } from "@/components/hero/HeroContent";
import { Ticker } from "@/components/sections/Ticker";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Membership } from "@/components/sections/Membership";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { ContactBanner } from "@/components/sections/ContactBanner";

const HeroAnimation = dynamic(
  () => import("@/components/hero/HeroAnimation").then((m) => m.HeroAnimation),
  { ssr: false }
);

const GoldZoomSection = dynamic(
  () =>
    import("@/components/sections/GoldZoomSection").then((m) => m.GoldZoomSection),
  { ssr: false }
);

export function HomePageClient() {
  return (
    <>
      <section className="relative min-h-[300vh]" aria-label="Hero">
        <HeroAnimation />
        <HeroContent />
      </section>
      <GoldZoomSection totalFrames={240} />
      <Ticker />
      <About />
      <Services />
      <Membership />
      <WhyChooseUs />
      <NewsPreview />
      <ContactBanner />
    </>
  );
}
