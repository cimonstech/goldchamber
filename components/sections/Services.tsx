"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const services = [
  {
    number: "01",
    title: "Regulatory Support",
    copy: "Navigate Ghana's gold licensing framework with confidence. We guide members through GoldBod compliance, application processes, regulatory updates, and the operational requirements of licensed gold trading.",
  },
  {
    number: "02",
    title: "Elite Networking",
    copy: "Connect with verified buyers, sellers, GoldBod Aggregators, and financial institutions across Ghana and beyond. Our exclusive network is built on verified credentials and shared standards.",
  },
  {
    number: "03",
    title: "Market Intelligence",
    copy: "Access real-time gold pricing data, regulatory news, and market insights that give our members a genuine competitive advantage. Knowledge is the foundation of trustworthy trade.",
  },
];

export function Services() {
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
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((s) => (
            <div
              key={s.number}
              className="group relative border border-gold/20 bg-dark/50 p-8 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="absolute top-8 right-8 font-display text-6xl font-light text-gold/10">
                {s.number}
              </span>
              <h3 className="font-display text-h3 text-white font-semibold mb-4 relative inline-block">
              <span className="relative">
                {s.title}
                <span className="absolute left-0 bottom-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </span>
            </h3>
              <p className="font-sans text-white/80 text-sm leading-relaxed font-light">
                {s.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
