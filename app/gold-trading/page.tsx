"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Shield,
  Network,
  BarChart2,
  Link2,
  GraduationCap,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

type GoldPriceData = {
  usd: { price_24k: number };
  ghs?: { price_24k: number };
  updatedAt: string;
};

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
          timers.push(
            setTimeout(() => {
              setVisible((v) => {
                const next = [...v];
                next[i] = true;
                return next;
              });
            }, i * delay)
          );
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

const SERVICES = [
  {
    icon: Shield,
    title: "Regulatory Support",
    description:
      "Navigate Ghana's gold licensing framework with confidence. We guide members through GoldBod compliance, application processes, regulatory updates, and the operational requirements of licensed gold trading.",
  },
  {
    icon: Network,
    title: "Elite Buyer Network",
    description:
      "Connect with verified buyers, sellers, GoldBod Aggregators, and financial institutions across Ghana and beyond. Our exclusive network is built on verified credentials and shared standards of excellence.",
  },
  {
    icon: BarChart2,
    title: "Market Intelligence",
    description:
      "Access real-time gold pricing data, regulatory news, and market insights that give our members a genuine competitive advantage. Knowledge is the foundation of trustworthy trade.",
  },
  {
    icon: Link2,
    title: "Blockchain Traceability",
    description:
      "Every transaction traceable from mine to market. Our blockchain-powered traceability system provides full transparency and auditability — giving international buyers the confidence to transact at scale.",
  },
  {
    icon: GraduationCap,
    title: "Training & Capacity",
    description:
      "Cutting-edge training on responsible mining, mercury-free processing, regulatory compliance, and business development — keeping CLGB members ahead of the industry curve.",
  },
  {
    icon: Landmark,
    title: "Financial & Legal Services",
    description:
      "Tailored financial products, credit facilities, legal advice, and insurance options designed specifically for the gold trading sector. We ensure our members are protected at every stage of the transaction.",
  },
] as const;

const STEPS = [
  {
    title: "Apply for Membership",
    description:
      "Complete the membership application form and select the tier that best fits your operation.",
  },
  {
    title: "Verification & Review",
    description:
      "Our team reviews your application, verifies your credentials, and contacts you within 48 hours.",
  },
  {
    title: "Certification Issued",
    description:
      "Upon approval, you receive your official CLGB certification — your mark of trust in the gold market.",
  },
  {
    title: "Access the Network",
    description:
      "Gain immediate access to GoldBod Aggregators, market intelligence tools, and the full CLGB member network.",
  },
] as const;

const PARTNERS = [
  {
    name: "GoldBod",
    description:
      "The Ghana Gold Board — the primary regulatory body overseeing licensed gold buying and aggregation in Ghana.",
    href: "https://goldbod.gov.gh",
    linkText: "Visit GoldBod →",
  },
  {
    name: "Ghana Minerals Commission",
    description:
      "The government body responsible for the regulation, management and development of Ghana's mineral resources.",
    href: "https://www.mincom.gov.gh",
    linkText: "Visit Minerals Commission →",
  },
  {
    name: "Bank of Ghana",
    description:
      "The central bank providing the monetary framework within which all gold trading financial transactions operate.",
    href: "https://www.bog.gov.gh",
    linkText: "Visit Bank of Ghana →",
  },
] as const;

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function GoldTradingPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const [priceData, setPriceData] = useState<GoldPriceData | null>(null);

  const intro = useFadeUp(0.15);
  const services = useFadeUpStagger(6, 0.15, 100);
  const steps = useFadeUpStagger(4, 0.15, 150);
  const partners = useFadeUpStagger(3, 0.15, 150);
  const imageFeature = useFadeUp(0.15);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const fetchPrice = async () => {
    try {
      const res = await fetch("/api/gold-price");
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      setPriceData(json);
    } catch {
      setPriceData(null);
    }
  };

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, 60_000);
    return () => clearInterval(id);
  }, []);

  const usd24k = priceData?.usd?.price_24k;
  const ghs24k = priceData?.ghs?.price_24k;
  const ghs22k = ghs24k != null ? ghs24k * 0.9167 : null;
  const ghs21k = ghs24k != null ? ghs24k * 0.875 : null;

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-center justify-center bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gold-bars2.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.9) 100%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <GoldDust particleCount={50} opacity={0.1} />
        </div>
        <div className="relative z-10 text-center px-4">
          <p
            className="mb-5 font-sans text-[9px] uppercase tracking-[3px]"
            style={{
              color: "rgba(201,168,76,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            HOME · GOLD TRADING
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
            Gold Trading Services
          </h1>
          <div className="w-[60px] h-px bg-[#C9A84C] mx-auto my-6" />
          <p
            className="font-display italic mx-auto max-w-[600px]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(16px, 1.8vw, 22px)",
              color: "rgba(201,168,76,0.8)",
              opacity: heroSubtitleVisible ? 1 : 0,
              transform: heroSubtitleVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms ease 200ms, transform 900ms ease 200ms",
            }}
          >
            Connecting Ghana&apos;s gold sector to the world — with integrity,
            transparency, and precision.
          </p>
        </div>
      </section>

      {/* SECTION 2 — LIVE GOLD PRICE STRIP */}
      <section
        className="bg-[#0a0a0a] py-8 px-[60px] max-md:px-6 border-t border-b border-[rgba(201,168,76,0.12)]"
      >
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-8">
          <div>
            <p
              className="font-sans text-[9px] uppercase tracking-[3px] mb-1"
              style={{
                color: "rgba(201,168,76,0.6)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              24K GOLD · USD
            </p>
            <p
              className="font-display font-medium text-[28px] text-[#F5D06A] inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {usd24k != null ? formatUSD(usd24k) : "---"}
              {usd24k != null && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                  aria-hidden
                />
              )}
            </p>
            <p
              className="font-sans text-[9px] mt-1"
              style={{
                color: "rgba(250,246,238,0.4)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              per troy oz
            </p>
          </div>
          <div>
            <p
              className="font-sans text-[9px] uppercase tracking-[3px] mb-1"
              style={{
                color: "rgba(201,168,76,0.6)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              24K GOLD · GHS
            </p>
            <p
              className="font-display font-medium text-[28px] text-[#F5D06A] inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {ghs24k != null ? formatGHS(ghs24k) : "---"}
              {ghs24k != null && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                  aria-hidden
                />
              )}
            </p>
            <p
              className="font-sans text-[9px] mt-1"
              style={{
                color: "rgba(250,246,238,0.4)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              per troy oz
            </p>
          </div>
          <div>
            <p
              className="font-sans text-[9px] uppercase tracking-[3px] mb-1"
              style={{
                color: "rgba(201,168,76,0.6)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              22K GOLD · GHS
            </p>
            <p
              className="font-display font-medium text-[28px] text-[#F5D06A] inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {ghs22k != null ? formatGHS(ghs22k) : "---"}
              {ghs22k != null && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                  aria-hidden
                />
              )}
            </p>
            <p
              className="font-sans text-[9px] mt-1"
              style={{
                color: "rgba(250,246,238,0.4)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              91.67% purity
            </p>
          </div>
          <div>
            <p
              className="font-sans text-[9px] uppercase tracking-[3px] mb-1"
              style={{
                color: "rgba(201,168,76,0.6)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              21K GOLD · GHS
            </p>
            <p
              className="font-display font-medium text-[28px] text-[#F5D06A] inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {ghs21k != null ? formatGHS(ghs21k) : "---"}
              {ghs21k != null && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                  aria-hidden
                />
              )}
            </p>
            <p
              className="font-sans text-[9px] mt-1"
              style={{
                color: "rgba(250,246,238,0.4)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              87.5% purity
            </p>
          </div>
          <p
            className="font-sans text-[9px] ml-auto"
            style={{
              color: "rgba(250,246,238,0.3)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Last updated: {priceData?.updatedAt ? formatTime(priceData.updatedAt) : "---"}
          </p>
        </div>
      </section>

      {/* SECTION 3 — INTRO STATEMENT */}
      <section
        ref={intro.ref}
        className="bg-[#050505] py-[100px] px-[60px] max-md:px-6 transition-all duration-700 ease-out"
        style={{
          opacity: intro.visible ? 1 : 0,
          transform: intro.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              WHAT WE DO
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] leading-[1.2]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 300,
              }}
            >
              The Infrastructure of Ghana&apos;s Gold Trade
            </h2>
          </div>
          <div className="space-y-5">
            <p
              className="font-sans text-[14px] font-light leading-[1.9]"
              style={{
                color: "rgba(250,246,238,0.65)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              The Chamber of Licensed Gold Buyers sits at the centre of
              Ghana&apos;s gold trading ecosystem. We do not just connect buyers and
              sellers — we build the infrastructure that makes every transaction
              credible, traceable, and compliant with national and international
              standards.
            </p>
            <p
              className="font-sans text-[14px] font-light leading-[1.9]"
              style={{
                color: "rgba(250,246,238,0.65)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              From the moment gold leaves the ground to the moment it reaches an
              international buyer, CLGB members operate within a framework that
              guarantees ethical sourcing, fair pricing, and full regulatory
              compliance. This is what separates a CLGB transaction from any
              other.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SIX SERVICES */}
      <section
        ref={services.ref}
        className="bg-[#0a0a0a] py-[120px] px-[60px] max-md:px-6"
      >
        <div className="text-center mb-16">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            OUR SERVICES
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 300,
            }}
          >
            How We Support Your Trade
          </h2>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="relative overflow-hidden p-10 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.3)]"
                style={{
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.12)",
                  opacity: services.visible[i] ? 1 : 0,
                  transform: services.visible[i]
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition:
                    "opacity 700ms ease, transform 700ms ease, all 300ms ease",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <span
                  className="absolute top-5 right-6 font-display text-[80px] font-light leading-none pointer-events-none"
                  style={{
                    color: "rgba(201,168,76,0.06)",
                    fontFamily:
                      "var(--font-cormorant), Cormorant Garamond, serif",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon
                  size={28}
                  className="mb-5"
                  style={{ color: "rgba(201,168,76,0.7)" }}
                />
                <h3
                  className="font-display font-medium text-[24px] text-[#FAF6EE] mb-3"
                  style={{
                    fontFamily:
                      "var(--font-cormorant), Cormorant Garamond, serif",
                  }}
                >
                  {s.title}
                </h3>
                <div className="w-full h-px bg-[rgba(201,168,76,0.15)] mb-3" />
                <p
                  className="font-sans text-[13px] font-light leading-[1.8]"
                  style={{
                    color: "rgba(250,246,238,0.55)",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section
        ref={steps.ref}
        className="bg-[#050505] py-[120px] px-[60px] max-md:px-6"
      >
        <div className="text-center mb-20">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            THE PROCESS
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 300,
            }}
          >
            From Application to Transaction
          </h2>
        </div>

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative text-center"
              style={{
                opacity: steps.visible[i] ? 1 : 0,
                transform: steps.visible[i]
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition: "opacity 700ms ease, transform 700ms ease",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-6 left-1/2 h-px bg-[rgba(201,168,76,0.3)] -translate-y-1/2"
                  style={{ width: "calc(100% + 3rem)" }}
                  aria-hidden
                />
              )}
              <div
                className="w-12 h-12 rounded-full border border-[#C9A84C] flex items-center justify-center mx-auto mb-6 relative z-[1]"
                style={{
                  fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                  fontSize: "22px",
                  color: "#C9A84C",
                }}
              >
                {i + 1}
              </div>
              <h3
                className="font-display text-[22px] text-[#FAF6EE] mb-3"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              >
                {step.title}
              </h3>
              <p
                className="font-sans text-[13px] font-light leading-[1.8] max-w-[220px] mx-auto"
                style={{
                  color: "rgba(250,246,238,0.55)",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — REGULATORY PARTNERS */}
      <section
        ref={partners.ref}
        className="bg-[#0a0a0a] py-20 px-[60px] max-md:px-6 border-t border-[rgba(201,168,76,0.12)]"
      >
        <div className="text-center mb-12">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            REGULATORY PARTNERS
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 300,
            }}
          >
            Operating Within the Framework
          </h2>
        </div>

        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {PARTNERS.map((p, i) => (
            <div
              key={p.name}
              className="text-center p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.3)]"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.1)",
                opacity: partners.visible[i] ? 1 : 0,
                transform: partners.visible[i]
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition:
                  "opacity 700ms ease, transform 700ms ease, all 300ms ease",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <ExternalLink
                size={20}
                className="mx-auto mb-4"
                style={{ color: "rgba(201,168,76,0.5)" }}
              />
              <h3
                className="font-display text-[22px] text-[#FAF6EE] mb-2"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              >
                {p.name}
              </h3>
              <p
                className="font-sans text-[12px] font-light leading-[1.8] mb-4"
                style={{
                  color: "rgba(250,246,238,0.5)",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {p.description}
              </p>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[9px] uppercase tracking-[2px] text-[#C9A84C] hover:underline"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {p.linkText}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — IMAGE FEATURE */}
      <section
        ref={imageFeature.ref}
        className="relative min-h-[500px] overflow-hidden flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          opacity: imageFeature.visible ? 1 : 0,
          transform: imageFeature.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/goldbars3.jpeg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 z-[1] bg-[rgba(5,5,5,0.75)]"
          aria-hidden
        />
        <div className="relative z-[2] max-w-[700px] mx-auto text-center py-[120px] px-[60px] max-md:px-6">
          <span
            className="block text-[12px] mb-6"
            style={{ color: "#C9A84C" }}
            aria-hidden
          >
            ◆
          </span>
          <blockquote
            className="font-display italic font-light text-[#FAF6EE] leading-[1.6]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(22px, 3vw, 36px)",
              fontWeight: 300,
            }}
          >
            Every gram of gold traded through a CLGB member carries with it a
            guarantee — of ethics, of compliance, and of Ghana&apos;s commitment to a
            gold sector the world can trust.
          </blockquote>
          <p
            className="font-sans text-[10px] uppercase tracking-[3px] mt-6"
            style={{
              color: "rgba(201,168,76,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            — The CLGB Charter
          </p>
        </div>
      </section>

      {/* SECTION 8 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
