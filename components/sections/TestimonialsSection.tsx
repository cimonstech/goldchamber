"use client";

import { useEffect, useRef, useState } from "react";

const CARD_STYLE = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-gold)",
  backdropFilter: "var(--card-backdrop)",
  WebkitBackdropFilter: "var(--card-backdrop)",
  borderRadius: 16,
  padding: 28,
} as const;

const testimonialsAll = [
  {
    photo: "/members/person1.webp",
    quote: "CLGB gave our business the credibility we needed to access top-tier buyers. The certification changed everything.",
    name: "ABENA SARFOA · LICENSED GOLD BUYER",
    stars: 5,
  },
  {
    photo: "/members/person2.webp",
    quote: "The regulatory support alone is worth the membership. We no longer navigate GoldBod compliance alone.",
    name: "JOHN BONSU · CORPORATE TRADER",
    stars: 5,
  },
  {
    photo: "/members/person3.webp",
    quote: "Being part of this network opened doors we never knew existed. The connections are invaluable.",
    name: "MILLICENT TETTEH · MINING PROFESSIONAL",
    stars: 5,
  },
  {
    photo: "/members/person4.webp",
    quote: "The live pricing tools and market intelligence give us a genuine edge in every transaction.",
    name: "EVANS BENSON · FINANCIAL INSTITUTION",
    stars: 5,
  },
  {
    photo: "/members/person5.webp",
    quote: "CLGB's certification is recognised across the industry. It transformed how buyers perceive our business.",
    name: "JOHN KEY · GOLD TRADER",
    stars: 5,
  },
  {
    photo: "/members/person6.webp",
    quote: "The Africa Ethical Gold Summit alone was worth joining. The network we built there is priceless.",
    name: "BATISTA SIMONS · INDEPENDENT BUYER",
    stars: 5,
  },
  {
    photo: "/members/person7.webp",
    quote: "Professional support and market access that has made a real difference to our operations.",
    name: "YVA KARIKARI · CHAMBER MEMBER",
    stars: 5,
  },
] as const;

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" style={{ fill: "var(--gold-primary)" }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [displayed, setDisplayed] = useState(() => {
    const shuffled = [...testimonialsAll].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [visible, setVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible([true, false, false]);
        const t1 = setTimeout(() => setVisible((v) => [true, true, v[2]]), 150);
        const t2 = setTimeout(() => setVisible([true, true, true]), 300);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 md:py-20 md:px-[60px]"
      style={{ backgroundColor: "var(--bg-primary)" }}
      aria-label="Member testimonials"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes testimonial-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes testimonial-float-mobile {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          .testimonial-float-pos-0 { animation: testimonial-float 3.5s ease-in-out 0s infinite; }
          .testimonial-float-pos-1 { animation: testimonial-float 4s ease-in-out 0.6s infinite; }
          .testimonial-float-pos-2 { animation: testimonial-float 3.8s ease-in-out 1.2s infinite; }
          @media (max-width: 767px) {
            .testimonial-float-pos-0 { animation: testimonial-float-mobile 3.5s ease-in-out 0s infinite; }
            .testimonial-float-pos-1 { animation: testimonial-float-mobile 4s ease-in-out 0.6s infinite; }
            .testimonial-float-pos-2 { animation: testimonial-float-mobile 3.8s ease-in-out 1.2s infinite; }
          }
        `,
      }} />
      <p
        className="font-sans text-[10px] uppercase tracking-[4px] text-gold text-center mb-4"
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        TRUSTED BY OUR MEMBERS
      </p>
        <h2
        className="font-display text-[48px] font-light text-center mb-16"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          marginBottom: 60,
        }}
      >
        What Our Members Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {displayed.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="will-change-transform transition-all duration-700 ease-out"
            style={{
              transform: `translateY(${visible[i] ? 0 : 40}px)`,
              opacity: visible[i] ? 1 : 0,
            }}
          >
            <div
              className={`h-full will-change-transform testimonial-float-pos-${i}`}
              style={CARD_STYLE}
            >
              <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: "var(--border-gold-strong)", backgroundColor: "var(--bg-primary)" }}>
                <img
                  src={t.photo}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} />
                ))}
              </div>
              <p
                className="mt-3 font-display italic text-base leading-[1.7]"
                style={{
                  fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                  color: "var(--text-secondary)",
                }}
              >
                {t.quote}
              </p>
              <p
                className="mt-4 font-sans text-[10px] uppercase tracking-[2px]"
                style={{ color: "var(--text-label)" }}
              >
                {t.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
