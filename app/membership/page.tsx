"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  User,
  Award,
  Building2,
  CheckCircle,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

const inputBase =
  "w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.2)] rounded-[2px] px-[18px] py-[14px] text-[#FAF6EE] font-sans text-[14px] outline-none transition-all duration-200 placeholder:text-[rgba(250,246,238,0.25)] focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]";

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

export default function MembershipPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    residentialAddress: "",
    businessName: "",
    businessRegistrationNumber: "",
    yearsInOperation: "",
    businessAddress: "",
    typeOfGoldActivity: "",
    membershipTier: "",
    howDidYouHear: "",
    additionalInfo: "",
    declaration1: false,
    declaration2: false,
    declaration3: false,
  });

  const tiers = useFadeUpStagger(3, 0.15, 150);
  const formSection = useFadeUp(0.15);
  const trustSignals = useFadeUpStagger(3, 0.15, 150);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const updateForm = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const required = [
      form.fullName,
      form.email,
      form.phone,
      form.dateOfBirth,
      form.nationality,
      form.residentialAddress,
      form.businessName,
      form.businessRegistrationNumber,
      form.yearsInOperation,
      form.businessAddress,
      form.typeOfGoldActivity,
      form.membershipTier,
      form.howDidYouHear,
    ];
    const allFilled = required.every((v) => v && String(v).trim() !== "");
    const allDeclarations = form.declaration1 && form.declaration2 && form.declaration3;

    if (!allFilled || !allDeclarations) {
      setValidationError(
        "Please complete all required fields and accept the declarations."
      );
      return;
    }

    // TODO: Connect to backend API route — POST /api/membership-application
    setSubmitted(true);
  };

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-center justify-center bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gold-bars.jpg"
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
              "linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.85) 100%)",
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
            HOME · MEMBERSHIP
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
            Join the Chamber
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
            Ghana&apos;s most trusted network of certified gold trading professionals.
          </p>
        </div>
      </section>

      {/* SECTION 2 — MEMBERSHIP TIERS */}
      <section
        ref={tiers.ref}
        className="bg-[#0a0a0a] py-[120px] px-[60px] max-md:px-6"
      >
        <div className="text-center mb-16">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            MEMBERSHIP TIERS
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE] mb-3"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 300,
            }}
          >
            Choose Your Level
          </h2>
          <p
            className="font-sans text-[14px] font-light mt-3"
            style={{
              color: "rgba(250,246,238,0.5)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            All tiers include full CLGB certification and access to the GoldBod
            network.
          </p>
        </div>

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {/* CARD 1 — ASSOCIATE */}
          <div
            className="relative overflow-hidden bg-[#111111] border border-[rgba(201,168,76,0.15)] p-[48px_40px] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_20px_60px_rgba(201,168,76,0.1)]"
            style={{
              borderTop: "3px solid rgba(201,168,76,0.4)",
              opacity: tiers.visible[0] ? 1 : 0,
              transform: tiers.visible[0]
                ? "translateY(0)"
                : "translateY(40px)",
              transition:
                "opacity 700ms ease, transform 700ms ease, all 300ms ease",
              transitionDelay: "0ms",
            }}
          >
            <p
              className="font-sans text-[10px] uppercase tracking-[4px]"
              style={{
                color: "rgba(201,168,76,0.7)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              ASSOCIATE
            </p>
            <User
              size={32}
              className="my-4"
              style={{ color: "rgba(201,168,76,0.6)" }}
            />
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-8"
              style={{
                color: "rgba(250,246,238,0.5)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              For individuals entering the gold trading sector who want to build
              credibility and access regulatory support.
            </p>
            <div className="w-full h-px bg-[rgba(201,168,76,0.15)] mb-6" />
            <ul className="space-y-3 mb-8">
              {[
                "CLGB Certification",
                "GoldBod Network Access",
                "Regulatory Guidance",
                "Member Newsletter",
                "Annual General Meeting Access",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#C9A84C" }}
                  />
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "rgba(250,246,238,0.65)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#membership-form"
              className="inline-block w-full text-center border border-[#C9A84C] bg-transparent text-[#C9A84C] py-3 px-7 font-sans text-[10px] uppercase tracking-[2px] transition-all duration-300 hover:bg-[#C9A84C] hover:text-[#050505]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Apply as Associate
            </a>
          </div>

          {/* CARD 2 — FULL MEMBER */}
          <div
            className="relative overflow-hidden bg-[#111111] border border-[rgba(201,168,76,0.15)] p-[48px_40px] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_20px_60px_rgba(201,168,76,0.1)]"
            style={{
              borderTop: "3px solid #C9A84C",
              opacity: tiers.visible[1] ? 1 : 0,
              transform: tiers.visible[1]
                ? "translateY(0)"
                : "translateY(40px)",
              transition:
                "opacity 700ms ease, transform 700ms ease, all 300ms ease",
              transitionDelay: "150ms",
            }}
          >
            <div
              className="absolute top-0 right-0 px-4 py-1.5 font-sans text-[8px] uppercase tracking-[2px] font-bold text-[#050505]"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              MOST POPULAR
            </div>
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              FULL MEMBER
            </p>
            <Award size={32} className="my-4" style={{ color: "#C9A84C" }} />
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-8"
              style={{
                color: "rgba(250,246,238,0.5)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              For established gold buyers and traders seeking full membership
              benefits, elite networking, and market intelligence.
            </p>
            <div className="w-full h-px bg-[rgba(201,168,76,0.15)] mb-6" />
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Associate",
                "Elite Buyer Network Access",
                "Real-Time Market Intelligence",
                "Legal & Financial Support",
                "Training & Capacity Building",
                "Blockchain Traceability Tools",
                "Priority GoldBod Aggregator Access",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#C9A84C" }}
                  />
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "rgba(250,246,238,0.65)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#membership-form"
              className="inline-block w-full text-center py-3 px-7 font-sans text-[10px] uppercase tracking-[2px] font-bold transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)]"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                color: "#050505",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Apply as Full Member
            </a>
          </div>

          {/* CARD 3 — CORPORATE */}
          <div
            className="relative overflow-hidden bg-[#111111] border border-[rgba(201,168,76,0.15)] p-[48px_40px] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_20px_60px_rgba(201,168,76,0.1)]"
            style={{
              borderTop: "3px solid rgba(201,168,76,0.4)",
              opacity: tiers.visible[2] ? 1 : 0,
              transform: tiers.visible[2]
                ? "translateY(0)"
                : "translateY(40px)",
              transition:
                "opacity 700ms ease, transform 700ms ease, all 300ms ease",
              transitionDelay: "300ms",
            }}
          >
            <p
              className="font-sans text-[10px] uppercase tracking-[4px]"
              style={{
                color: "rgba(201,168,76,0.7)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              CORPORATE
            </p>
            <Building2
              size={32}
              className="my-4"
              style={{ color: "rgba(201,168,76,0.6)" }}
            />
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-8"
              style={{
                color: "rgba(250,246,238,0.5)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              For companies, financial institutions, and large-scale operations
              requiring tailored support and institutional-level access.
            </p>
            <div className="w-full h-px bg-[rgba(201,168,76,0.15)] mb-6" />
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Full Member",
                "Dedicated Account Manager",
                "Custom Compliance Framework",
                "Institutional GoldBod Partnerships",
                "Board-Level Representation",
                "Bespoke Training Programmes",
                "International Buyer Introductions",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#C9A84C" }}
                  />
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "rgba(250,246,238,0.65)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#membership-form"
              className="inline-block w-full text-center border border-[#C9A84C] bg-transparent text-[#C9A84C] py-3 px-7 font-sans text-[10px] uppercase tracking-[2px] transition-all duration-300 hover:bg-[#C9A84C] hover:text-[#050505]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Apply as Corporate
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MEMBERSHIP APPLICATION FORM */}
      <section
        id="membership-form"
        ref={formSection.ref}
        className="relative bg-[#050505] py-[120px] px-[60px] max-md:px-6 overflow-hidden transition-all duration-700 ease-out"
        style={{
          opacity: formSection.visible ? 1 : 0,
          transform: formSection.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <GoldDust particleCount={40} opacity={0.08} />
        <div className="relative z-[1] max-w-[800px] mx-auto">
          <div className="text-center mb-16">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              APPLY NOW
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] mb-3"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 300,
              }}
            >
              Begin Your Application
            </h2>
            <p
              className="font-sans text-[14px] font-light"
              style={{
                color: "rgba(250,246,238,0.5)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Complete the form below and a member of our team will be in touch
              within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle
                size={48}
                className="mx-auto mb-6"
                style={{ color: "#C9A84C" }}
              />
              <h3
                className="font-display text-[36px] text-[#FAF6EE] mb-4"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              >
                Application Received
              </h3>
              <p
                className="font-sans text-[14px] max-w-md mx-auto"
                style={{
                  color: "rgba(250,246,238,0.6)",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Thank you for applying. A member of our team will be in touch
                within 48 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[2px] p-[60px] max-md:p-8"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              {/* Group 1 — PERSONAL INFORMATION */}
              <div className="mb-10">
                <div
                  className="font-sans text-[10px] uppercase tracking-[2px] mb-6"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  PERSONAL INFORMATION
                </div>
                <div className="w-full h-px bg-[rgba(201,168,76,0.1)] mb-6" />
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => updateForm("fullName", e.target.value)}
                    className={inputBase}
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className={inputBase}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className={inputBase}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        updateForm("dateOfBirth", e.target.value)
                      }
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Nationality
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nationality}
                      onChange={(e) =>
                        updateForm("nationality", e.target.value)
                      }
                      className={inputBase}
                      placeholder="e.g. Ghanaian"
                    />
                  </div>
                </div>
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Residential Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={form.residentialAddress}
                    onChange={(e) =>
                      updateForm("residentialAddress", e.target.value)
                    }
                    className={`${inputBase} resize-none`}
                    placeholder="Your full residential address"
                  />
                </div>
              </div>

              {/* Group 2 — BUSINESS INFORMATION */}
              <div className="mb-10">
                <div
                  className="font-sans text-[10px] uppercase tracking-[2px] mb-6"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  BUSINESS INFORMATION
                </div>
                <div className="w-full h-px bg-[rgba(201,168,76,0.1)] mb-6" />
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) =>
                      updateForm("businessName", e.target.value)
                    }
                    className={inputBase}
                    placeholder="Your business or company name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Business Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={form.businessRegistrationNumber}
                      onChange={(e) =>
                        updateForm(
                          "businessRegistrationNumber",
                          e.target.value
                        )
                      }
                      className={inputBase}
                      placeholder="Registration number"
                    />
                  </div>
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Years in Operation
                    </label>
                    <select
                      required
                      value={form.yearsInOperation}
                      onChange={(e) =>
                        updateForm("yearsInOperation", e.target.value)
                      }
                      className={inputBase}
                    >
                      <option value="">Select</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1–3 years">1–3 years</option>
                      <option value="3–5 years">3–5 years</option>
                      <option value="5–10 years">5–10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>
                </div>
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Business Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={form.businessAddress}
                    onChange={(e) =>
                      updateForm("businessAddress", e.target.value)
                    }
                    className={`${inputBase} resize-none`}
                    placeholder="Your business address"
                  />
                </div>
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Type of Gold Activity
                  </label>
                  <select
                    required
                    value={form.typeOfGoldActivity}
                    onChange={(e) =>
                      updateForm("typeOfGoldActivity", e.target.value)
                    }
                    className={inputBase}
                  >
                    <option value="">Select</option>
                    <option value="Buying">Buying</option>
                    <option value="Selling">Selling</option>
                    <option value="Both">Both</option>
                    <option value="Mining">Mining</option>
                    <option value="Processing">Processing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Group 3 — MEMBERSHIP SELECTION */}
              <div className="mb-10">
                <div
                  className="font-sans text-[10px] uppercase tracking-[2px] mb-6"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  MEMBERSHIP SELECTION
                </div>
                <div className="w-full h-px bg-[rgba(201,168,76,0.1)] mb-6" />
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Membership Tier
                  </label>
                  <select
                    required
                    value={form.membershipTier}
                    onChange={(e) =>
                      updateForm("membershipTier", e.target.value)
                    }
                    className={inputBase}
                  >
                    <option value="">Select tier</option>
                    <option value="Associate">Associate</option>
                    <option value="Full Member">Full Member</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    How did you hear about us?
                  </label>
                  <select
                    required
                    value={form.howDidYouHear}
                    onChange={(e) =>
                      updateForm("howDidYouHear", e.target.value)
                    }
                    className={inputBase}
                  >
                    <option value="">Select</option>
                    <option value="GoldBod">GoldBod</option>
                    <option value="Ghana Minerals Commission">
                      Ghana Minerals Commission
                    </option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="News Article">News Article</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-7">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Additional Information / Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.additionalInfo}
                    onChange={(e) =>
                      updateForm("additionalInfo", e.target.value)
                    }
                    className={`${inputBase} resize-none`}
                    placeholder="Tell us more about your business and why you are applying for CLGB membership..."
                  />
                </div>
              </div>

              {/* Group 4 — DECLARATIONS */}
              <div className="mb-10">
                <div
                  className="font-sans text-[10px] uppercase tracking-[2px] mb-6"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  DECLARATIONS
                </div>
                <div className="w-full h-px bg-[rgba(201,168,76,0.1)] mb-6" />
                {[
                  {
                    key: "declaration1" as const,
                    text: "I confirm that all information provided is accurate and truthful.",
                  },
                  {
                    key: "declaration2" as const,
                    text: "I agree to the CLGB Code of Conduct and Ethical Trading Standards.",
                  },
                  {
                    key: "declaration3" as const,
                    text: "I consent to CLGB contacting me regarding my application.",
                  },
                ].map(({ key, text }) => (
                  <label
                    key={key}
                    className="flex gap-3 items-start mb-5 cursor-pointer"
                  >
                    <span className="relative flex-shrink-0 mt-0.5 inline-flex">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) =>
                          updateForm(key, e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <span
                        className="block w-4 h-4 border rounded-[2px] transition-all duration-200 peer-checked:bg-[#C9A84C] peer-checked:border-[#C9A84C]"
                        style={{
                          borderColor: "rgba(201,168,76,0.4)",
                        }}
                      />
                      <svg
                        className="absolute inset-0 m-auto w-2.5 h-2.5 text-[#FAF6EE] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span
                      className="font-sans text-[13px] font-light"
                      style={{
                        color: "rgba(250,246,238,0.65)",
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      {text}
                    </span>
                  </label>
                ))}
              </div>

              {validationError && (
                <p
                  className="font-sans text-[12px] mb-4"
                  style={{
                    color: "#ef4444",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {validationError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-[18px] font-sans text-[11px] uppercase tracking-[3px] font-bold text-[#050505] rounded-[2px] cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] mt-10"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                  border: "none",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 4 — TRUST SIGNALS */}
      <section
        ref={trustSignals.ref}
        className="bg-[#0a0a0a] py-20 px-[60px] max-md:px-6"
      >
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div
            style={{
              opacity: trustSignals.visible[0] ? 1 : 0,
              transform: trustSignals.visible[0]
                ? "translateY(0)"
                : "translateY(40px)",
              transition: "opacity 700ms ease, transform 700ms ease",
              transitionDelay: "0ms",
            }}
          >
            <Shield
              size={32}
              className="mx-auto mb-4"
              style={{ color: "#C9A84C" }}
            />
            <h3
              className="font-display text-[22px] text-[#FAF6EE] mb-2"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              GoldBod Certified
            </h3>
            <p
              className="font-sans text-[13px] font-light leading-[1.8]"
              style={{
                color: "rgba(250,246,238,0.55)",
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Every CLGB member operates under the full certification of the
              Ghana Gold Board.
            </p>
          </div>
          <div
            style={{
              opacity: trustSignals.visible[1] ? 1 : 0,
              transform: trustSignals.visible[1]
                ? "translateY(0)"
                : "translateY(40px)",
              transition: "opacity 700ms ease, transform 700ms ease",
              transitionDelay: "150ms",
            }}
          >
            <Clock
              size={32}
              className="mx-auto mb-4"
              style={{ color: "#C9A84C" }}
            />
            <h3
              className="font-display text-[22px] text-[#FAF6EE] mb-2"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              48-Hour Response
            </h3>
            <p
              className="font-sans text-[13px] font-light leading-[1.8]"
              style={{
                color: "rgba(250,246,238,0.55)",
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Our team reviews every application within 48 hours and contacts
              you directly.
            </p>
          </div>
          <div
            style={{
              opacity: trustSignals.visible[2] ? 1 : 0,
              transform: trustSignals.visible[2]
                ? "translateY(0)"
                : "translateY(40px)",
              transition: "opacity 700ms ease, transform 700ms ease",
              transitionDelay: "300ms",
            }}
          >
            <Users
              size={32}
              className="mx-auto mb-4"
              style={{ color: "#C9A84C" }}
            />
            <h3
              className="font-display text-[22px] text-[#FAF6EE] mb-2"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              500+ Members Strong
            </h3>
            <p
              className="font-sans text-[13px] font-light leading-[1.8]"
              style={{
                color: "rgba(250,246,238,0.55)",
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Join a growing network of licensed professionals across Ghana and
              beyond.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
