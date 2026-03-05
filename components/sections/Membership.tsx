"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MemberAvatarsRow } from "@/components/membership/MemberAvatars";

const benefits = [
  "GoldBod Access",
  "Networking",
  "Certification",
  "Legal Support",
];

export function Membership() {
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
        "relative z-10 py-section md:py-section-md sm:py-section-sm transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-4">
          Membership
        </span>
        <h2 className="font-display text-h1 text-white font-light mb-6">
          Join Ghana&apos;s Most Trusted Gold Trading Network
        </h2>
        <p className="font-sans text-white/85 text-base max-w-3xl leading-relaxed mb-8 font-light">
          Our members enjoy exclusive access to GoldBod Aggregators, networking opportunities,
          regulatory support, market insights, and a certification that reinforces credibility
          across the entire gold industry. Whether you are an individual buyer, corporate entity,
          or financial institution, CLGB is the ultimate gateway to trustworthy gold transactions.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          {benefits.map((b) => (
            <span
              key={b}
              className="border border-gold/40 px-4 py-2 font-sans text-xs uppercase tracking-wider text-white"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/membership"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm"
          >
            Explore Membership
          </Link>
          <MemberAvatarsRow />
        </div>
      </div>
    </section>
  );
}
