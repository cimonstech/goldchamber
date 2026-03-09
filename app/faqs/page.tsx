"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, MessageCircle, Award } from "lucide-react";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "Membership" | "Gold Trading" | "Regulatory" | "GoldBod" | "General";
}

const faqs: FAQ[] = [
  {
    id: "what-is-clgb",
    category: "Membership",
    question: "What is the Chamber of Licensed Gold Buyers?",
    answer:
      "The Chamber of Licensed Gold Buyers (CLGB) is Ghana's foremost association representing certified gold trading professionals. We serve as the bridge between miners, buyers, and regulatory institutions — ensuring every transaction is transparent, ethical, and fully compliant with Ghana's gold trading laws.",
  },
  {
    id: "who-can-join",
    category: "Membership",
    question: "Who can apply for CLGB membership?",
    answer:
      "CLGB membership is open to individuals, corporate entities, and financial institutions involved in gold buying, selling, processing, or brokering in Ghana. All applicants must hold or be in the process of obtaining a valid GoldBod licence. We offer three membership tiers — Associate, Full Member, and Corporate — to suit different levels of operation.",
  },
  {
    id: "membership-benefits",
    category: "Membership",
    question: "What are the benefits of CLGB membership?",
    answer:
      "CLGB members gain access to a wide range of benefits including direct access to GoldBod Aggregators, real-time gold pricing tools, the CLGB certification mark, regulatory guidance, elite networking opportunities, legal and financial support, blockchain traceability tools, and training programmes. Full Member and Corporate tiers unlock additional premium benefits.",
  },
  {
    id: "how-to-apply",
    category: "Membership",
    question: "How do I apply for membership?",
    answer:
      "You can apply directly through our Membership page at goldchamber.vercel.app/membership. Complete the application form with your personal and business information, select your preferred membership tier, and submit. Our team will review your application and contact you within 48 hours.",
  },
  {
    id: "membership-tiers",
    category: "Membership",
    question: "What is the difference between Associate, Full Member, and Corporate tiers?",
    answer:
      "Associate membership is designed for individuals entering the gold trading sector who want to build credibility and access basic regulatory support. Full Member is for established gold buyers and traders seeking full membership benefits, elite networking, and market intelligence. Corporate membership is for companies, financial institutions, and large-scale operations requiring tailored support and institutional-level access to GoldBod partnerships.",
  },
  {
    id: "membership-fee",
    category: "Membership",
    question: "Is there a membership fee?",
    answer:
      "Membership fee details are provided directly to applicants upon review of their application. Fees vary by tier and are structured to reflect the level of benefits and support provided. Contact us at business@chamberofgoldbuyers.com for current fee information.",
  },
  {
    id: "what-is-gold-trading",
    category: "Gold Trading",
    question: "What gold trading services does CLGB provide?",
    answer:
      "CLGB provides a comprehensive suite of services supporting the full gold trading lifecycle: regulatory support and GoldBod compliance guidance, access to an elite buyer and seller network, real-time market intelligence and pricing tools, blockchain-powered transaction traceability, training and capacity building, and tailored financial and legal services for gold traders.",
  },
  {
    id: "fair-pricing",
    category: "Gold Trading",
    question: "How does CLGB ensure fair pricing for gold transactions?",
    answer:
      "CLGB members have access to real-time gold pricing data sourced from international markets, displayed in both USD and GHS across 24K, 22K, and 21K purity levels. This pricing transparency ensures that both buyers and sellers can transact with confidence that prices reflect the true market value of gold at any given time.",
  },
  {
    id: "blockchain",
    category: "Gold Trading",
    question: "What is blockchain traceability and why does it matter?",
    answer:
      "Blockchain traceability is a system that creates an immutable digital record of every gold transaction — from the mine of origin through processing, buying, and export. This record is transparent and verifiable by any authorised party, including buyers, regulators, and international institutions. For CLGB members, blockchain traceability is a powerful tool for proving the ethical sourcing of their gold to international buyers who increasingly require this assurance.",
  },
  {
    id: "international-buyers",
    category: "Gold Trading",
    question: "Can CLGB connect me with international gold buyers?",
    answer:
      "Yes. Corporate membership includes access to international buyer introductions facilitated by CLGB. Our network extends beyond Ghana to connect members with verified international buyers who require ethically sourced, fully certified Ghanaian gold. Contact our secretariat to discuss your specific requirements.",
  },
  {
    id: "goldbod-licence",
    category: "Regulatory",
    question: "Do I need a GoldBod licence to join CLGB?",
    answer:
      "All CLGB members are expected to hold a valid GoldBod licence or be actively in the process of obtaining one. CLGB can assist members through the GoldBod licensing process, providing guidance on documentation requirements, application procedures, and compliance obligations. Operating as a gold buyer in Ghana without a GoldBod licence is a regulatory offence.",
  },
  {
    id: "regulatory-support",
    category: "Regulatory",
    question: "What regulatory support does CLGB provide?",
    answer:
      "CLGB provides comprehensive regulatory support including guidance on GoldBod compliance, assistance with licence applications and renewals, updates on regulatory changes, support during regulatory inspections, and access to legal expertise specialising in Ghana's gold trading legislation. Our team monitors the regulatory environment continuously and keeps members informed of any changes that affect their operations.",
  },
  {
    id: "compliance",
    category: "Regulatory",
    question: "What happens if a member is found to be non-compliant?",
    answer:
      "CLGB takes compliance very seriously. Members found to be operating outside the terms of their GoldBod licence or in breach of the CLGB Code of Conduct may face suspension or termination of their CLGB membership. CLGB will cooperate fully with GoldBod and other regulatory authorities in any investigation. We strongly encourage all members to maintain full compliance at all times and to contact us immediately if they encounter any regulatory concerns.",
  },
  {
    id: "what-is-goldbod",
    category: "GoldBod",
    question: "What is GoldBod?",
    answer:
      "GoldBod — the Ghana Gold Board — is the primary regulatory body established by the Government of Ghana to oversee licensed gold buying and aggregation in Ghana. GoldBod is responsible for issuing licences to gold buyers, regulating the pricing framework for gold transactions, and ensuring that Ghana's gold sector operates with full transparency and accountability. All legitimate gold buyers in Ghana must be licensed by GoldBod.",
  },
  {
    id: "goldbod-aggregators",
    category: "GoldBod",
    question: "What are GoldBod Aggregators?",
    answer:
      "GoldBod Aggregators are a select group of licensed entities empowered by the Government of Ghana to purchase gold directly from licensed buyers at competitive, regulated prices. Access to GoldBod Aggregators is one of the most valuable benefits of CLGB membership, as they represent the most reliable and transparent route to market for licensed gold buyers in Ghana.",
  },
  {
    id: "goldbod-receipts",
    category: "GoldBod",
    question: "What are GoldBod receipts and are they mandatory?",
    answer:
      "GoldBod receipts are the official documentation required for every gold transaction in Ghana. They provide a traceable record linking a transaction to a licensed buyer, a verified source, and a declared quantity and purity of gold. As of October 2025, GoldBod has commenced active enforcement of mandatory GoldBod receipt usage. All licensed buyers — including all CLGB members — are required to use GoldBod receipts in every transaction. Failure to do so may result in regulatory sanctions.",
  },
  {
    id: "contact",
    category: "General",
    question: "How do I contact CLGB?",
    answer:
      "You can reach us by phone at +233 266 10 9898, by email at business@chamberofgoldbuyers.com, or by completing the contact form on our Contact page. Our digital address is AK-009-2554. We are based in Kumasi, Ghana, and our team responds to all enquiries within 48 hours.",
  },
  {
    id: "response-time",
    category: "General",
    question: "How quickly will CLGB respond to my enquiry?",
    answer:
      "We aim to respond to all membership applications, contact form submissions, and direct enquiries within 48 hours on business days. For urgent regulatory matters, please call us directly at +233 266 10 9898.",
  },
  {
    id: "confidential",
    category: "General",
    question: "Is my application and personal information kept confidential?",
    answer:
      "Yes. All information submitted to CLGB through our membership application form or contact form is treated with strict confidentiality. Your information is used solely for the purpose of processing your application or responding to your enquiry and is not shared with third parties without your consent, except where required by law or regulatory authority.",
  },
];

const CATEGORIES = ["All", "Membership", "Gold Trading", "Regulatory", "GoldBod", "General"];

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

export default function FAQsPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const accordionSection = useFadeUp(0.15);
  const ctaCards = useFadeUpStagger(2, 0.15, 150);

  const filtered = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[50vh] overflow-hidden flex items-center justify-center bg-[#050505]">
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
              "linear-gradient(to bottom, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.92) 100%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <GoldDust particleCount={40} opacity={0.1} />
        </div>
        <div className="relative z-10 text-center px-4">
          <p
            className="mb-5 font-sans text-[9px] uppercase tracking-[3px]"
            style={{
              color: "rgba(255,255,255,0.9)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            HOME · FAQS
          </p>
          <h1
            className="font-display font-light text-[#FAF6EE] mb-6"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 300,
              opacity: heroTitleVisible ? 1 : 0,
              transform: heroTitleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 900ms ease, transform 900ms ease",
            }}
          >
            Frequently Asked Questions
          </h1>
          <div className="w-[60px] h-px bg-white/90 mx-auto my-6" />
          <p
            className="font-display italic mx-auto max-w-[600px]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(16px, 1.8vw, 22px)",
              color: "rgba(255,255,255,0.95)",
              opacity: heroSubtitleVisible ? 1 : 0,
              transform: heroSubtitleVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 900ms ease 200ms, transform 900ms ease 200ms",
            }}
          >
            Everything you need to know about CLGB, membership, and gold trading
            in Ghana.
          </p>
        </div>
      </section>

      {/* SECTION 2 — FAQ SEARCH */}
      <section className="theme-bg-secondary py-12 px-[60px] max-md:px-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-[600px] mx-auto relative">
          <Search
            size={16}
            className="absolute left-[18px] top-1/2 -translate-y-1/2"
            style={{ color: "var(--gold-primary)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-[2px] pl-12 pr-[18px] py-4 font-sans text-[14px] outline-none transition-all duration-200 focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </section>

      {/* SECTION 3 — FAQ CATEGORIES AND ACCORDION */}
      <section
        ref={accordionSection.ref}
        className="theme-bg-primary py-20 px-[60px] max-md:px-6 transition-all duration-700 ease-out"
        style={{
          opacity: accordionSection.visible ? 1 : 0,
          transform: accordionSection.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="font-sans text-[10px] uppercase tracking-[2px] py-2 px-5 border cursor-pointer transition-all duration-200"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  ...(activeCategory === cat
                    ? {
                        background: "var(--gold-primary)",
                        color: "#050505",
                        borderColor: "var(--gold-primary)",
                        fontWeight: 700,
                      }
                    : {
                        background: "transparent",
                        color: "var(--text-muted)",
                        borderColor: "var(--input-border)",
                      }),
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p
              className="font-sans text-[13px] text-center mt-8"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              No questions found for that search.
            </p>
          ) : (
            <>
              <p
                className="font-sans text-[11px] mb-6"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {filtered.length} questions
              </p>
              <div className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                {filtered.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border-b overflow-hidden"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full py-6 flex justify-between items-center gap-4 cursor-pointer text-left group"
                      >
                        {activeCategory === "All" && (
                          <span
                            className="shrink-0 font-sans text-[8px] uppercase tracking-[2px] px-2.5 py-0.5 border rounded-[2px]"
                            style={{
                              borderColor: "var(--border-gold)",
                              color: "var(--text-label)",
                              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                            }}
                          >
                            {faq.category}
                          </span>
                        )}
                        <span
                          className="flex-1 font-display font-medium text-[20px] leading-[1.3] transition-colors duration-300 group-hover:text-[var(--gold-highlight)]"
                          style={{
                            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                            color: "var(--text-primary)",
                          }}
                        >
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={18}
                          className="shrink-0 transition-transform duration-300"
                          style={{
                            color: "#C9A84C",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </button>
                      <div
                        className="overflow-hidden transition-[max-height] duration-300 ease-out"
                        style={{ maxHeight: isOpen ? 500 : 0 }}
                      >
                        <div className="pb-6">
                          <p
                            className="font-sans text-[14px] font-light leading-[1.9]"
                            style={{
                              color: "var(--text-secondary)",
                              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 4 — STILL HAVE QUESTIONS */}
      <section
        ref={ctaCards.ref}
        className="theme-bg-secondary py-20 px-[60px] max-md:px-6 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          <Link
            href="/contact"
            className="block p-10 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              opacity: ctaCards.visible[0] ? 1 : 0,
              transform: ctaCards.visible[0]
                ? "translateY(0)"
                : "translateY(40px)",
              transition:
                "opacity 700ms ease, transform 700ms ease, all 300ms ease",
              transitionDelay: "0ms",
            }}
          >
            <MessageCircle
              size={32}
              className="mb-4"
              style={{ color: "#C9A84C" }}
            />
            <h3
              className="font-display text-[26px] mb-3"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                color: "var(--text-primary)",
              }}
            >
              Still Have Questions?
            </h3>
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-6"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Our team is happy to answer any question not covered here. Reach
              out directly and we will respond within 48 hours.
            </p>
            <span
              className="inline-block border border-[#C9A84C] bg-transparent text-[#C9A84C] py-2.5 px-6 font-sans text-[10px] uppercase tracking-[2px] transition-all duration-300 hover:bg-[#C9A84C] hover:text-[#050505]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Contact Us →
            </span>
          </Link>
          <Link
            href="/membership"
            className="block p-10 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.3)]"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              opacity: ctaCards.visible[1] ? 1 : 0,
              transform: ctaCards.visible[1]
                ? "translateY(0)"
                : "translateY(40px)",
              transition:
                "opacity 700ms ease, transform 700ms ease, all 300ms ease",
              transitionDelay: "150ms",
            }}
          >
            <Award
              size={32}
              className="mb-4"
              style={{ color: "#C9A84C" }}
            />
            <h3
              className="font-display text-[26px] mb-3"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                color: "var(--text-primary)",
              }}
            >
              Ready to Join?
            </h3>
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-6"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              If you have read enough and are ready to apply for CLGB membership,
              start your application today.
            </p>
            <span
              className="inline-block py-2.5 px-6 font-sans text-[10px] uppercase tracking-[2px] font-bold transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                color: "#050505",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Apply for Membership →
            </span>
          </Link>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
