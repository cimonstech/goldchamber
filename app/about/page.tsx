"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Shield, Eye, BookOpen, Leaf } from "lucide-react";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

const CORE_VALUES = [
  {
    icon: Shield,
    title: "Integrity Above All",
    description:
      "Every decision, every transaction, every membership we certify is held to the same standard: complete integrity. We do not compromise on the ethical foundations of the gold trade.",
  },
  {
    icon: Eye,
    title: "Transparency in Trade",
    description:
      "From pricing to sourcing to regulatory compliance, we believe that transparency is the bedrock of a sustainable gold sector. Our members trade in the open, with nothing to hide.",
  },
  {
    icon: BookOpen,
    title: "Empowerment Through Knowledge",
    description:
      "We invest in our members. Through training, capacity building, and market intelligence, we ensure every licensed gold buyer has the knowledge to operate profitably and responsibly.",
  },
  {
    icon: Leaf,
    title: "Sustainability for Generations",
    description:
      "The gold beneath Ghana's soil belongs to all Ghanaians. We are committed to a gold sector that honours the environment, supports mining communities, and creates lasting prosperity.",
  },
] as const;

const BENEFITS = [
  { num: "01", title: "GoldBod Access", description: "Direct access to GoldBod Aggregators — government-empowered buyers who purchase gold at competitive, transparent prices." },
  { num: "02", title: "Fair Pricing Tools", description: "Real-time pricing intelligence that guarantees fair compensation for every transaction, protecting both buyers and sellers." },
  { num: "03", title: "CLGB Certification", description: "A recognised mark of trust. The CLGB seal signals to buyers, institutions, and regulators that your business meets the highest standards." },
  { num: "04", title: "Regulatory Navigation", description: "Expert guidance through Ghana's gold licensing framework — GoldBod compliance, application processes, and regulatory updates." },
  { num: "05", title: "Elite Network", description: "Exclusive access to a verified network of licensed buyers, sellers, aggregators, and financial institutions across Ghana and beyond." },
  { num: "06", title: "Blockchain Traceability", description: "Full transparency from mine to market. Every transaction is traceable, provable, and fully auditable by buyers and regulators." },
  { num: "07", title: "Training & Capacity", description: "Cutting-edge training on responsible mining, mercury-free processing, and regulatory compliance — keeping your team ahead of the industry." },
  { num: "08", title: "Financial Services", description: "Tailored financial products, insurance options, and credit facilities designed specifically for the gold trading sector." },
  { num: "09", title: "Legal Support", description: "Access to legal expertise covering gold trading law, licensing disputes, contract review, and regulatory compliance." },
  { num: "10", title: "Market Intelligence", description: "Exclusive market reports, regulatory updates, and gold price analysis that give CLGB members a genuine competitive advantage." },
] as const;

const ACCREDITATIONS = [
  "GoldBod Certified",
  "Ghana Minerals Commission Partner",
  "Ethical Sourcing Guaranteed",
  "Blockchain Traceability",
  "London Good Delivery Standard",
  "999.9 Fineness",
] as const;

const LEADERSHIP_TEASERS = [
  { name: "The Founder", title: "FOUNDER · CLGB", href: "/about/leadership#job-osei-tutu", image: "/founder.webp" },
  { name: "The Co-Founder", title: "CO-FOUNDER · CLGB", href: "/about/leadership#daniel-boateng-sarpong", image: "/co-founder-pic.webp" },
  { name: "Acting CEO", title: "ACTING CEO · CLGB", href: "/about/leadership#kwaku-amoah", image: "/AG.CEO.webp" },
] as const;

function useFadeUp(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useFadeUpStagger(count: number, threshold = 0.15, delay = 150) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(Array(count).fill(false));
        const timers: ReturnType<typeof setTimeout>[] = [];
        for (let i = 0; i < count; i++) {
          timers.push(setTimeout(() => {
            setVisible((v) => {
              const next = [...v];
              next[i] = true;
              return next;
            });
          }, i * delay));
        }
        return () => timers.forEach(clearTimeout);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, threshold, delay]);

  return { ref, visible };
}

export default function AboutPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const mission = useFadeUp(0.15);
  const storySection = useFadeUp(0.15);
  const [storyVisible, setStoryVisible] = useState(false);
  const [storyImageVisible, setStoryImageVisible] = useState(false);

  useEffect(() => {
    if (!storySection.visible) return;
    setStoryVisible(true);
    const t = setTimeout(() => setStoryImageVisible(true), 150);
    return () => clearTimeout(t);
  }, [storySection.visible]);
  const leadership = useFadeUpStagger(3, 0.15, 150);
  const values = useFadeUpStagger(4, 0.15, 150);
  const benefits = useFadeUpStagger(10, 0.15, 100);
  const accreditation = useFadeUp(0.15);

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[55vh] bg-[#050505] overflow-hidden flex items-center justify-center">
        <GoldDust particleCount={60} opacity={0.12} />
        <div className="relative z-10 text-center px-4">
          <p
            className="mb-5 font-sans text-[9px] uppercase tracking-[3px]"
            style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            HOME · ABOUT
          </p>
          <h1
            className="font-display font-light text-[#FAF6EE] mb-6"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(56px, 8vw, 96px)",
              fontWeight: 300,
              opacity: heroTitleVisible ? 1 : 0,
              transform: heroTitleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 900ms ease, transform 900ms ease",
            }}
          >
            About CLGB
          </h1>
          <div className="w-[60px] h-px bg-[#C9A84C] mx-auto my-6" />
          <p
            className="font-display italic text-[#C9A84C]/80"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(18px, 2vw, 24px)",
              opacity: heroSubtitleVisible ? 1 : 0,
              transform: heroSubtitleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 900ms ease 200ms, transform 900ms ease 200ms",
            }}
          >
            Built on Trust. Driven by Gold.
          </p>
        </div>
      </section>

      {/* SECTION 2 — MISSION STATEMENT */}
      <section
        ref={mission.ref}
        className="py-[100px] px-6 md:px-[60px] bg-[#0a0a0a] transition-all duration-700 ease-out"
        style={{
          opacity: mission.visible ? 1 : 0,
          transform: mission.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[900px] mx-auto text-center">
          <span className="block text-[#C9A84C] text-xs mb-8">◆</span>
          <blockquote
            className="font-display italic font-light text-[#FAF6EE] leading-[1.6]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(24px, 3vw, 42px)",
            }}
          >
            The Chamber of Licensed Gold Buyers was established with a singular purpose: to create a
            credible, regulated, and transparent ecosystem for gold trading in Ghana. We are not just
            an association — we are a standard.
          </blockquote>
          <span className="block text-[#C9A84C] text-xs mt-8">◆</span>
        </div>
      </section>

      {/* SECTION 3 — OUR STORY */}
      <section ref={storySection.ref} className="py-[120px] px-6 md:px-[60px] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: storyVisible ? 1 : 0,
              transform: storyVisible ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              OUR STORY
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] mb-8"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 300,
              }}
            >
              Built on Trust. Driven by Gold.
            </h2>
            <div className="space-y-5 font-sans text-sm leading-[1.9] font-light" style={{ color: "rgba(250,246,238,0.65)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
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
          <div
            className="relative transition-all duration-700 ease-out"
            style={{
              opacity: storyImageVisible ? 1 : 0,
              transform: storyImageVisible ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <div
              className="absolute border border-[rgba(201,168,76,0.2)] -z-[1] pointer-events-none"
              style={{ top: -16, right: -16, bottom: 16, left: 16 }}
              aria-hidden
            />
            <div className="relative z-[1] aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/golds.jpg"
                alt="CLGB gold"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 z-[2] py-5 px-6"
              style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)" }}
            >
              <span className="font-display font-bold text-[#050505] block text-[28px]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>CLGB</span>
              <span className="font-sans text-[9px] uppercase tracking-[2px] text-[#050505]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — LEADERSHIP TEASER */}
      <section className="py-[120px] px-6 md:px-[60px] bg-[#0a0a0a]">
        <div className="text-center mb-16">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            OUR LEADERSHIP
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 300,
            }}
          >
            The Faces Behind the Standard
          </h2>
        </div>
        <div ref={leadership.ref} className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP_TEASERS.map((person, i) => (
            <Link
              key={i}
              href={person.href}
              className="text-center p-8 rounded-2xl border border-[rgba(201,168,76,0.25)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[rgba(201,168,76,0.5)]"
              style={{
                background: "rgba(201,168,76,0.08)",
                backdropFilter: "blur(12px)",
                opacity: leadership.visible[i] ? 1 : 0,
                transform: leadership.visible[i] ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 700ms ease, transform 700ms ease, all 300ms ease",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[rgba(201,168,76,0.4)]">
                <Image src={person.image} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <p className="font-display font-medium text-[#FAF6EE] text-[22px] mb-1.5" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>{person.name}</p>
              <p className="font-sans text-[9px] uppercase tracking-[3px] mb-5" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{person.title}</p>
              <div className="w-full h-px bg-[rgba(201,168,76,0.15)] mb-5" />
              <span className="font-sans text-[10px] uppercase tracking-[2px] text-[#C9A84C]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>View Profile →</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/about/leadership"
            className="inline-block font-sans text-[10px] font-bold uppercase tracking-[3px] py-3.5 px-9 rounded-sm cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)]"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #8B6914)",
              color: "#050505",
              border: "none",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Meet Our Leadership →
          </Link>
        </div>
      </section>

      {/* SECTION 5 — CORE VALUES */}
      <section className="relative py-[120px] px-6 md:px-[60px] bg-[#050505] overflow-hidden">
        <GoldDust particleCount={50} opacity={0.1} />
        <div className="relative z-[1]">
          <div className="text-center mb-16">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              CORE VALUES
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 300,
              }}
            >
              What We Stand For
            </h2>
          </div>
          <div ref={values.ref} className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {CORE_VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-10 border border-[rgba(201,168,76,0.12)] transition-all duration-300 ease-out hover:bg-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1"
                  style={{
                    background: "rgba(201,168,76,0.04)",
                    opacity: values.visible[i] ? 1 : 0,
                    transform: values.visible[i] ? "translateY(0)" : "translateY(40px)",
                    transition: "opacity 700ms ease, transform 700ms ease, all 300ms ease",
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  <Icon size={28} style={{ color: "rgba(201,168,76,0.7)" }} className="mb-5" />
                  <h3 className="font-display font-medium text-[#FAF6EE] text-2xl mb-3" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>{v.title}</h3>
                  <div className="w-full h-px bg-[rgba(201,168,76,0.15)] mb-3" />
                  <p className="font-sans text-[13px] font-light leading-[1.8]" style={{ color: "rgba(250,246,238,0.55)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHY CHOOSE US */}
      <section className="py-[120px] px-6 md:px-[60px] bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              WHY CHOOSE US
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 300,
              }}
            >
              The CLGB Advantage
            </h2>
          </div>
          <div ref={benefits.ref} className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex gap-5 items-start py-7 border-b border-[rgba(201,168,76,0.1)] transition-all duration-300 ease-out group hover:[&_.benefit-num]:text-[rgba(201,168,76,0.7)] hover:[&_.benefit-title]:text-[#F5D06A]"
                style={{
                  opacity: benefits.visible[i] ? 1 : 0,
                  transform: benefits.visible[i] ? "translateY(0)" : "translateY(40px)",
                  transition: "opacity 700ms ease, transform 700ms ease, all 300ms ease",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <span className="benefit-num font-display font-light shrink-0 w-12 leading-none transition-colors duration-300" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 42, color: "rgba(201,168,76,0.25)" }}>{b.num}</span>
                <div>
                  <h3 className="benefit-title font-display text-[20px] text-[#FAF6EE] mb-2 transition-colors duration-300" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>{b.title}</h3>
                  <p className="font-sans text-[13px] font-light leading-[1.8]" style={{ color: "rgba(250,246,238,0.55)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — ACCREDITATION BAR */}
      <section
        ref={accreditation.ref}
        className="py-10 px-6 md:px-[60px] bg-[#0a0a0a] border-t border-b border-[rgba(201,168,76,0.12)] flex flex-wrap justify-center gap-12 transition-all duration-700 ease-out"
        style={{
          opacity: accreditation.visible ? 1 : 0,
          transform: accreditation.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        {ACCREDITATIONS.map((label, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-[#C9A84C] text-[8px]">◆</span>
            <span className="font-sans text-[10px] uppercase tracking-[3px]" style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{label}</span>
          </div>
        ))}
      </section>

      {/* SECTION 8 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
