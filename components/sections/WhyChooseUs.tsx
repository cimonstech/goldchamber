"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const benefits = [
  "Access to GoldBod Aggregators — top-tier buyers empowered by the Government to purchase gold at competitive prices.",
  "Fair & Transparent Pricing — real-time pricing tools that guarantee fair compensation for miners and traders.",
  "Rigorous Certification — the CLGB seal is a recognised mark of trust, assuring buyers that your gold is ethically sourced and fully compliant.",
  "Training & Capacity Building — cutting-edge training on responsible mining, mercury-free processing, and regulatory compliance.",
  "Blockchain-Powered Traceability — full transparency from mine to market, provable to buyers and regulators.",
  "Financial & Legal Support — tailored financial services, legal advice, and insurance options designed for the gold trade.",
];

const accreditations: { label: string; href?: string }[] = [
  { label: "GoldBod Certified", href: "https://goldbod.gov.gh" },
  { label: "Ghana Minerals Commission", href: "https://www.mincom.gov.gh/" },
  { label: "Ethical Sourcing" },
];

export function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "relative z-10 py-section md:py-section-md sm:py-section-sm bg-dark-2 transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <blockquote className="font-display text-2xl md:text-3xl font-light text-white leading-snug border-l-4 border-gold pl-8">
              &ldquo;Together, we can transform West Africa&apos;s gold sector into a beacon of ethical
              trade, sustainability, and shared prosperity.&rdquo;
            </blockquote>
            <div className="mt-12 relative w-full aspect-[4/3] max-w-[21rem] overflow-hidden rounded-sm border border-gold/30">
              <Image
                src="/founder.webp"
                alt="Founder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 85vw, 21rem"
              />
            </div>
          </div>
          <div>
            <ul className="space-y-4">
              {benefits.map((item, i) => (
                <li
                  key={i}
                  className="font-sans text-sm text-white/85 leading-relaxed pl-4 border-l-2 border-gold/30 hover:border-gold/70 transition-colors py-1"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              {accreditations.map((a) =>
                a.href ? (
                  <Link
                    key={a.label}
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs uppercase tracking-wider text-gold/90 border border-gold/40 px-3 py-1.5 hover:bg-gold/10 hover:border-gold/60 transition-colors"
                  >
                    {a.label}
                  </Link>
                ) : (
                  <span
                    key={a.label}
                    className="font-sans text-xs uppercase tracking-wider text-gold/90 border border-gold/40 px-3 py-1.5"
                  >
                    {a.label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
