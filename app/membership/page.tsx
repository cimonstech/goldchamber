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
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

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
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [hasBusiness, setHasBusiness] = useState(false);
  const [documents, setDocuments] = useState<{ type: string; file: File }[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Personal info — always required
    const personalRequired = [
      form.fullName,
      form.email,
      form.phone,
      form.dateOfBirth,
      form.nationality,
      form.residentialAddress,
    ];
    const personalFilled = personalRequired.every((v) => v && String(v).trim() !== "");

    // Business info — required only if hasBusiness
    const businessFilled = !hasBusiness || [
      form.businessName,
      form.businessRegistrationNumber,
      form.yearsInOperation,
      form.businessAddress,
    ].every((v) => v && String(v).trim() !== "");

    // Membership selection — always required
    const selectionFilled = form.typeOfGoldActivity && form.membershipTier && form.howDidYouHear;
    const allDeclarations = form.declaration1 && form.declaration2 && form.declaration3;

    if (!personalFilled) {
      setValidationError("Please complete all personal information fields.");
      return;
    }
    if (!businessFilled) {
      setValidationError("Please complete all business information fields.");
      return;
    }
    if (!selectionFilled) {
      setValidationError("Please select your membership tier, gold activity type, and how you heard about us.");
      return;
    }
    if (!allDeclarations) {
      setValidationError("Please accept all three declarations.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, string | null> = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth || null,
        nationality: form.nationality.trim(),
        residentialAddress: form.residentialAddress.trim(),
        businessName: hasBusiness ? form.businessName.trim() : null,
        businessRegistration: hasBusiness ? form.businessRegistrationNumber.trim() : null,
        businessAddress: hasBusiness ? form.businessAddress.trim() : null,
        yearsInOperation: hasBusiness ? form.yearsInOperation : null,
        goldActivity: form.typeOfGoldActivity,
        membershipTier: form.membershipTier,
        howHeard: form.howDidYouHear,
        additionalInfo: form.additionalInfo?.trim() || null,
      };

      let res: Response;
      if (documents.length > 0) {
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => formData.append(k, v ?? ""));
        documents.forEach((d, i) => {
          formData.append(`document${i}`, d.file);
          formData.append(`document${i}Type`, d.type);
        });
        res = await fetch("/api/applications/submit", { method: "POST", body: formData });
      } else {
        res = await fetch("/api/applications/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setValidationError(data.error ?? "An application with this email already exists.");
        } else {
          setValidationError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      setSubmitted(true);
    } catch {
      setValidationError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              color: "rgba(255,255,255,0.9)",
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
            Ghana&apos;s most trusted network of certified gold trading professionals.
          </p>
        </div>
      </section>

      {/* SECTION 2 — MEMBERSHIP TIERS */}
      <section
        ref={tiers.ref}
        className="theme-bg-secondary theme-text-primary py-[120px] px-[60px] max-md:px-6"
      >
        <div className="text-center mb-16">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] mb-4"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", color: "var(--gold-primary)" }}
          >
            MEMBERSHIP TIERS
          </p>
          <h2
            className="font-display font-light mb-3"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 300,
              color: "var(--text-primary)",
            }}
          >
            Choose Your Level
          </h2>
          <p
            className="font-sans text-[14px] font-light mt-3"
            style={{
              color: "var(--text-secondary)",
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
            className="relative overflow-hidden border p-[48px_40px] transition-all duration-300 ease-out hover:-translate-y-2"
            style={{
              background: "var(--bg-card-solid)",
              borderColor: "var(--border-gold)",
              borderTop: "3px solid var(--border-gold-strong)",
              boxShadow: "0 0 0 1px var(--border-subtle)",
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
                color: "var(--text-label)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              ASSOCIATE
            </p>
            <User
              size={32}
              className="my-4"
              style={{ color: "var(--gold-primary)" }}
            />
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-8"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              For individuals entering the gold trading sector who want to build
              credibility and access regulatory support.
            </p>
            <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
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
                    style={{ color: "var(--gold-primary)" }}
                  />
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "var(--text-secondary)",
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
              className="gold-outline-btn inline-block w-full text-center border py-3 px-7 font-sans text-[10px] uppercase tracking-[2px] font-bold transition-all duration-300"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                borderColor: "var(--gold-primary)",
                color: "var(--gold-primary)",
                backgroundColor: "transparent",
              }}
            >
              Apply as Associate
            </a>
          </div>

          {/* CARD 2 — FULL MEMBER */}
          <div
            className="relative overflow-hidden border p-[48px_40px] transition-all duration-300 ease-out hover:-translate-y-2"
            style={{
              background: "var(--bg-card-solid)",
              borderColor: "var(--border-gold-strong)",
              borderTop: "3px solid var(--gold-primary)",
              boxShadow: "0 0 0 1px var(--border-gold)",
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
              className="font-sans text-[10px] uppercase tracking-[4px]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                color: "var(--gold-primary)",
              }}
            >
              FULL MEMBER
            </p>
            <Award size={32} className="my-4" style={{ color: "var(--gold-primary)" }} />
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-8"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              For established gold buyers and traders seeking full membership
              benefits, elite networking, and market intelligence.
            </p>
            <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
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
                    style={{ color: "var(--gold-primary)" }}
                  />
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "var(--text-secondary)",
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
              className="inline-block w-full text-center py-3 px-7 font-sans text-[10px] uppercase tracking-[2px] font-bold transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: "var(--gold-gradient)",
                color: "#050505",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Apply as Full Member
            </a>
          </div>

          {/* CARD 3 — CORPORATE */}
          <div
            className="relative overflow-hidden border p-[48px_40px] transition-all duration-300 ease-out hover:-translate-y-2"
            style={{
              background: "var(--bg-card-solid)",
              borderColor: "var(--border-gold)",
              borderTop: "3px solid var(--border-gold-strong)",
              boxShadow: "0 0 0 1px var(--border-subtle)",
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
                color: "var(--text-label)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              CORPORATE
            </p>
            <Building2
              size={32}
              className="my-4"
              style={{ color: "var(--gold-primary)" }}
            />
            <p
              className="font-sans text-[13px] font-light leading-[1.8] mb-8"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              For companies, financial institutions, and large-scale operations
              requiring tailored support and institutional-level access.
            </p>
            <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
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
                    style={{ color: "var(--gold-primary)" }}
                  />
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "var(--text-secondary)",
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
              className="gold-outline-btn inline-block w-full text-center border py-3 px-7 font-sans text-[10px] uppercase tracking-[2px] font-bold transition-all duration-300"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                borderColor: "var(--gold-primary)",
                color: "var(--gold-primary)",
                backgroundColor: "transparent",
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
        className="theme-bg-primary theme-text-primary relative py-[120px] px-[60px] max-md:px-6 overflow-hidden transition-all duration-700 ease-out"
        style={{
          opacity: formSection.visible ? 1 : 0,
          transform: formSection.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <GoldDust particleCount={40} opacity={0.08} />
        <div className="relative z-[1] max-w-[800px] mx-auto">
          <div className="text-center mb-16">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] mb-4"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                color: "var(--gold-primary)",
              }}
            >
              APPLY NOW
            </p>
            <h2
              className="font-display font-light mb-3"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 300,
                color: "var(--text-primary)",
              }}
            >
              Begin Your Application
            </h2>
            <p
              className="font-sans text-[14px] font-light"
              style={{
                color: "var(--text-secondary)",
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
                style={{ color: "var(--gold-primary)" }}
              />
              <h3
                className="font-display text-[36px] mb-4"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
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
                Thank you for applying. Our team will review your application and contact you within 48 hours. If approved, you will receive an email with instructions to set up your account.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="theme-form rounded-[2px] p-[60px] max-md:p-8"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
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
                <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
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

              {/* Group 2 — BUSINESS INFORMATION (optional) */}
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
                <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
                <label className="flex gap-3 items-start mb-6 cursor-pointer">
                  <span className="relative flex-shrink-0 mt-0.5 inline-flex">
                    <input
                      type="checkbox"
                      checked={hasBusiness}
                      onChange={(e) => setHasBusiness(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span
                      className="block w-4 h-4 border rounded-[2px] transition-all duration-200 peer-checked:bg-[var(--gold-primary)] peer-checked:border-[var(--gold-primary)]"
                      style={{ borderColor: "var(--input-border)" }}
                    />
                    <svg
                      className="absolute inset-0 m-auto w-2.5 h-2.5 text-[#FAF6EE] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span
                    className="font-sans text-[13px] font-light"
                    style={{
                      color: "rgba(250,246,238,0.65)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    I have a business or company
                  </span>
                </label>
                {hasBusiness && (
                  <div className="space-y-7 animate-in fade-in duration-200">
                    <div>
                      <label
                        className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                        style={{
                          color: "rgba(250,246,238,0.6)",
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        }}
                      >
                        Business / Company Name
                      </label>
                      <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) => updateForm("businessName", e.target.value)}
                        className={inputBase}
                        placeholder="Your business or company name"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                          style={{
                            color: "rgba(250,246,238,0.6)",
                            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          }}
                        >
                          Business Registration Number
                        </label>
                        <input
                          type="text"
                          value={form.businessRegistrationNumber}
                          onChange={(e) => updateForm("businessRegistrationNumber", e.target.value)}
                          className={inputBase}
                          placeholder="Registration number"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                          style={{
                            color: "rgba(250,246,238,0.6)",
                            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          }}
                        >
                          Years in Operation
                        </label>
                        <select
                          value={form.yearsInOperation}
                          onChange={(e) => updateForm("yearsInOperation", e.target.value)}
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
                    <div>
                      <label
                        className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                        style={{
                          color: "rgba(250,246,238,0.6)",
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        }}
                      >
                        Business Address
                      </label>
                      <textarea
                        rows={2}
                        value={form.businessAddress}
                        onChange={(e) => updateForm("businessAddress", e.target.value)}
                        className={`${inputBase} resize-none`}
                        placeholder="Your business address"
                      />
                    </div>
                  </div>
                )}
                <div className="mb-7 mt-7">
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
                <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
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
                <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
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
                        className="block w-4 h-4 border rounded-[2px] transition-all duration-200 peer-checked:bg-[var(--gold-primary)] peer-checked:border-[var(--gold-primary)]"
                        style={{ borderColor: "var(--input-border)" }}
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

              {/* Group 5 — DOCUMENTS (optional) */}
              <div className="mb-10">
                <div
                  className="font-sans text-[10px] uppercase tracking-[2px] mb-6"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  DOCUMENTS (OPTIONAL)
                </div>
                <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--rule-color)" }} />
                <p
                  className="font-sans text-[12px] mb-4"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  Upload supporting documents (Ghana Card, Registration Certificate, etc.). PDF, JPEG, PNG or WebP. Max 10MB each.
                </p>
                {documents.map((d, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-3 mb-4">
                    <select
                      value={d.type}
                      onChange={(e) =>
                        setDocuments((prev) => {
                          const next = [...prev];
                          next[i] = { ...next[i]!, type: e.target.value };
                          return next;
                        })
                      }
                      className={`${inputBase} flex-1 min-w-[180px]`}
                    >
                      <option value="ghana_card">Ghana Card</option>
                      <option value="reg_certificate">Registration Certificate</option>
                      <option value="business_registration">Business Registration</option>
                      <option value="other">Other</option>
                    </select>
                    <span
                      className="font-sans text-[12px] truncate max-w-[140px]"
                      style={{ color: "rgba(250,246,238,0.7)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      {d.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocuments((prev) => prev.filter((_, j) => j !== i))}
                      className="font-sans text-[11px] uppercase text-[#ef4444] hover:underline"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3">
                  <select
                    id="new-doc-type"
                    defaultValue="ghana_card"
                    className={`${inputBase} w-auto min-w-[180px]`}
                  >
                    <option value="ghana_card">Ghana Card</option>
                    <option value="reg_certificate">Registration Certificate</option>
                    <option value="business_registration">Business Registration</option>
                    <option value="other">Other</option>
                  </select>
                  <label
                    className="inline-flex items-center gap-2 px-4 py-3 rounded border cursor-pointer transition-colors hover:bg-[rgba(201,168,76,0.08)]"
                    style={{
                      borderColor: "var(--gold-primary)",
                      color: "var(--gold-primary)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: 12,
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          setValidationError("File must be under 10MB.");
                          return;
                        }
                        const typeSelect = document.getElementById("new-doc-type") as HTMLSelectElement;
                        setDocuments((prev) => [...prev, { type: typeSelect?.value ?? "other", file }]);
                        e.target.value = "";
                      }}
                    />
                    + Add Document
                  </label>
                </div>
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
                disabled={submitting}
                className="w-full py-[18px] font-sans text-[11px] uppercase tracking-[3px] font-bold text-[#050505] rounded-[2px] cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] mt-10 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                  border: "none",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {submitting ? "Submitting..." : "Submit Application"}
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
