import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Chamber of Licensed Gold Buyers — Ghana's premier association for certified gold trading. Built on trust, driven by gold.",
  openGraph: {
    title: "About — Chamber of Licensed Gold Buyers",
    description: "Ghana's premier association for certified gold trading. Built on trust, driven by gold.",
  },
};

const aboutLinks = [
  { href: "/about", label: "Our Story", active: true },
  { href: "/about/leadership", label: "Leadership", active: false },
  { href: "/about/core-values", label: "Core Values", active: false },
  { href: "/about/why-choose-us", label: "Why Choose Us", active: false },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Built on Trust. Driven by Gold."
        label="About"
        links={aboutLinks}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-section md:py-section-md">
        <div className="grid md:grid-cols-[minmax(280px,380px)_1fr] gap-12 md:gap-16 items-start">
          <div className="relative aspect-[4/3] md:aspect-[3/4] max-h-[320px] md:max-h-none overflow-hidden rounded-sm border border-gold/20">
            <Image
              src="/business_gold.webp"
              alt="CLGB business and gold"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 380px"
            />
          </div>
          <div className="font-sans text-cream/80 text-base leading-relaxed space-y-6 font-light min-w-0">
            <p>
              The Chamber of Licensed Gold Buyers was established with a singular purpose: to create a
              credible, regulated, and transparent ecosystem for gold trading in Ghana. We are not just
              an association — we are a standard. A mark of integrity that the industry, regulators,
              and international buyers can rely on.
            </p>
            <p>
              Ghana is one of Africa&apos;s leading gold producers. Yet for too long, the sector has been
              fragmented — vulnerable to exploitation, regulatory gaps, and a lack of unified
              professional standards. CLGB exists to change that. We bring together licensed buyers,
              mining communities, government bodies, and financial institutions under a single, trusted
              framework.
            </p>
            <p>
              Our members operate with the full backing of the CLGB certification — a recognised mark
              that their business is legitimate, their sourcing is ethical, and their practices meet
              the highest standards in the industry.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
