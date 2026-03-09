"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle,
} from "lucide-react";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

const inputBase =
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Membership Application",
  "Regulatory Support",
  "Gold Trading",
  "Media & Press",
  "Other",
];

const CONTACT_ITEMS = [
  { icon: Phone, label: "PHONE", value: "+233 266 10 9898" },
  { icon: Mail, label: "EMAIL", value: "business@chamberofgoldbuyers.com" },
  { icon: MapPin, label: "DIGITAL ADDRESS", value: "AK-009-2554" },
  { icon: Clock, label: "RESPONSE TIME", value: "Within 48 hours" },
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

export default function ContactPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const contactSection = useFadeUp(0.15);
  const locationSection = useFadeUp(0.15);
  const faqSection = useFadeUp(0.15);

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

    const required = [form.fullName, form.email, form.subject, form.message];
    const allFilled = required.every((v) => v && String(v).trim() !== "");
    const consentGiven = form.consent;

    if (!allFilled || !consentGiven) {
      setValidationError("Please complete all required fields.");
      return;
    }

    // TODO: Connect to backend API route — POST /api/contact
    setSubmitted(true);
  };

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[55vh] overflow-hidden flex items-center justify-center bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/golds.jpg"
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
              "linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.92) 100%)",
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
            HOME · CONTACT
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
            Get in Touch
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
            We are here to answer your questions about membership, trading, and
            regulatory compliance.
          </p>
        </div>
      </section>

      {/* SECTION 2 — CONTACT DETAILS + FORM */}
      <section className="theme-bg-primary theme-text-primary py-[120px] px-[60px] max-md:px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-20 items-start">
          {/* LEFT COLUMN — Contact Details */}
          <div
            ref={contactSection.ref}
            className="transition-all duration-700 ease-out"
            style={{
              opacity: contactSection.visible ? 1 : 0,
              transform: contactSection.visible ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-6"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              REACH US DIRECTLY
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] leading-[1.2] mb-6"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 300,
              }}
            >
              We Would Love to Hear From You
            </h2>
            <p
              className="font-sans text-[14px] font-light leading-[1.9] mb-12"
              style={{
                color: "rgba(250,246,238,0.6)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Whether you are exploring membership, have a regulatory question, or
              want to connect with our team — reach out and we will respond
              within 48 hours.
            </p>

            {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex gap-4 items-start mb-7"
              >
                <div
                  className="w-10 h-10 shrink-0 border flex items-center justify-center"
                  style={{ borderColor: "var(--border-gold)", color: "var(--gold-primary)" }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <p
                    className="font-sans text-[9px] uppercase tracking-[2px] mb-1"
                    style={{
                      color: "rgba(201,168,76,0.6)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="font-sans text-[14px] text-[#FAF6EE]"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}

            <div className="w-full h-px my-10" style={{ backgroundColor: "var(--rule-color)" }} />

            <p
              className="font-sans text-[9px] uppercase tracking-[3px] mb-4 block"
              style={{
                color: "rgba(201,168,76,0.5)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              FOLLOW US
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Twitter, href: "https://twitter.com", label: "X" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-social-link w-10 h-10 border flex items-center justify-center transition-all duration-300"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--gold-primary)",
                  }}
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Contact Form */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: contactSection.visible ? 1 : 0,
              transform: contactSection.visible ? "translateY(0)" : "translateY(40px)",
              transitionDelay: "100ms",
            }}
          >
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
                    fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                  }}
                >
                  Message Sent
                </h3>
                <p
                  className="font-sans text-[14px]"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  Thank you for reaching out. We will be in touch within 48 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="theme-form p-12 rounded-[2px]"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="mb-6">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                      style={{
                        color: "rgba(250,246,238,0.6)",
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
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
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className={inputBase}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Subject
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => updateForm("subject", e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Select subject</option>
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
                    style={{
                      color: "rgba(250,246,238,0.6)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => updateForm("message", e.target.value)}
                    className={`${inputBase} resize-none`}
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <label className="flex gap-3 items-start mb-8 cursor-pointer">
                  <span className="relative flex-shrink-0 mt-0.5 inline-flex">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => updateForm("consent", e.target.checked)}
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
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    I consent to CLGB storing and using my information to respond
                    to this enquiry.
                  </span>
                </label>

                {validationError && (
                  <p
                    className="font-sans text-[12px] mb-4"
                    style={{
                      color: "#ef4444",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {validationError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 font-sans text-[11px] uppercase tracking-[3px] font-bold text-[#050505] rounded-[2px] cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                    border: "none",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 — OFFICE LOCATION */}
      <section
        ref={locationSection.ref}
        className="theme-bg-secondary theme-text-primary py-20 px-[60px] max-md:px-6 transition-all duration-700 ease-out"
        style={{
          opacity: locationSection.visible ? 1 : 0,
          transform: locationSection.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-4"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              OUR LOCATION
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 300,
              }}
            >
              Find Us in Ghana
            </h2>
          </div>

          <div className="max-w-[800px] mx-auto">
            <div
              className="border overflow-hidden"
              style={{ borderColor: "var(--border-gold)" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.30!2d-1.6731!3d6.6885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb96f35b7de625%3A0x8f1e9a4f7a0b0e3b!2sKumasi%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1"
                width="100%"
                height={400}
                style={{ border: 0, filter: "grayscale(100%) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CLGB - Kumasi, Ghana"
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Kumasi+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] uppercase tracking-[2px] text-[#C9A84C] hover:underline"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FAQ TEASER */}
      <section
        ref={faqSection.ref}
        className="theme-bg-primary theme-text-primary py-20 px-[60px] max-md:px-6 border-t transition-all duration-700 ease-out"
        style={{
          borderTopColor: "var(--border-subtle)",
          opacity: faqSection.visible ? 1 : 0,
          transform: faqSection.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[700px] mx-auto text-center">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            HAVE MORE QUESTIONS?
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE] mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 300,
            }}
          >
            Check Our FAQs
          </h2>
          <p
            className="font-sans text-[14px] font-light mb-8"
            style={{
              color: "rgba(250,246,238,0.55)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            We have answered the most common questions about membership, gold
            trading, and regulatory compliance in our FAQ section.
          </p>
          <Link
            href="/faqs"
            className="gold-outline-btn inline-block border bg-transparent py-3 px-8 font-sans text-[10px] uppercase tracking-[2px] transition-all duration-300"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              borderColor: "var(--gold-primary)",
              color: "var(--gold-primary)",
            }}
          >
            View FAQs →
          </Link>
        </div>
      </section>
    </>
  );
}
