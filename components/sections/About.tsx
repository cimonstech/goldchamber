"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const stats = [
  { value: "500+", label: "Members" },
  { value: "GoldBod", label: "Certified" },
  { value: "100%", label: "Compliant" },
  { value: "3", label: "Gov. Partners" },
];

export function About() {
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-4">
              Who We Are
            </span>
            <h2 className="font-display text-h1 font-light mb-6" style={{ color: "var(--text-primary)" }}>
              The Gold Standard of Trusted Trade
            </h2>
            <p className="font-sans text-base leading-relaxed mb-6 font-light" style={{ color: "var(--text-secondary)" }}>
              The Chamber of Licensed Gold Buyers (CLGB) is Ghana&apos;s foremost association representing
              certified gold trading professionals. We serve as the bridge between miners, buyers, and
              regulatory institutions — ensuring every transaction is transparent, ethical, and fully
              compliant with Ghana&apos;s gold trading laws.
            </p>
            <p className="font-sans text-base leading-relaxed mb-10 font-light" style={{ color: "var(--text-secondary)" }}>
              By working closely with GoldBod, the Ghana Minerals Commission, and financial
              institutions, we safeguard the integrity of Ghana&apos;s gold sector while creating
              meaningful opportunities for our members — individuals, corporate entities, and
              financial institutions who demand the highest standards in trade.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border py-4 px-4 text-center"
                  style={{ borderColor: "var(--border-gold)", backgroundColor: "var(--bg-primary)" }}
                >
                  <p className="font-display text-2xl font-semibold text-gold">{stat.value}</p>
                  <p className="font-sans text-xs uppercase tracking-wider mt-1" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] relative overflow-hidden">
              <Image
                src="/golds.jpg"
                alt="Gold standard"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 border py-4 px-6" style={{ borderColor: "var(--border-gold-strong)", backgroundColor: "var(--bg-primary)" }}>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-gold">
                  Ghana Minerals Commission Partner
                </p>
                <p className="font-display text-lg mt-1" style={{ color: "var(--text-primary)" }}>
                  Regulated · Ethical · Transparent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
