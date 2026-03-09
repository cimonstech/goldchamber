"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { articles } from "@/lib/articles";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

const CATEGORIES = ["All", "Press Release", "Regulatory", "Industry News"];

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

export default function NewsroomPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const router = useRouter();

  const featured = useFadeUp(0.15);
  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);
  const articlesGrid = useFadeUpStagger(Math.max(filteredArticles.length, 1), 0.15, 100);
  const newsletter = useFadeUp(0.15);

  const featuredArticle = articles.find((a) => a.featured);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newsletterEmail.trim())) {
      // TODO: Connect to email service
      setNewsletterSubscribed(true);
    }
  };

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[55vh] overflow-hidden flex items-center justify-center bg-[#050505]">
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
            HOME · NEWSROOM
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
            News & Insights
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
            Official communications, regulatory updates, and industry news from
            CLGB.
          </p>
        </div>
      </section>

      {/* SECTION 2 — FEATURED ARTICLE */}
      {featuredArticle && (
        <section
          ref={featured.ref}
          className="theme-bg-secondary theme-text-primary py-20 px-[60px] max-md:px-6 transition-all duration-700 ease-out"
          style={{
            opacity: featured.visible ? 1 : 0,
            transform: featured.visible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 border overflow-hidden" style={{ borderColor: "var(--border-gold)" }}>
            <div className="relative min-h-[400px]">
              <Image
                src={featuredArticle.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute top-6 left-6 px-4 py-1.5 font-sans text-[8px] uppercase tracking-[2px] font-bold text-[#050505]"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {featuredArticle.category}
              </div>
              <div
                className="absolute top-6 right-6 px-4 py-1.5 font-sans text-[8px] uppercase tracking-[2px] text-[#C9A84C]"
                style={{
                  background: "rgba(5,5,5,0.8)",
                  border: "1px solid var(--border-gold-strong)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                FEATURED
              </div>
            </div>
            <div className="theme-bg-tertiary p-12">
              <p
                className="font-sans text-[10px] uppercase tracking-[3px] mb-4"
                style={{
                  color: "rgba(201,168,76,0.6)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {featuredArticle.date}
              </p>
              <h2
                className="font-display font-light text-[#FAF6EE] leading-[1.2] mb-5"
                style={{
                  fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                  fontSize: "clamp(28px, 3vw, 42px)",
                  fontWeight: 300,
                }}
              >
                {featuredArticle.title}
              </h2>
              <p
                className="font-sans text-[14px] font-light leading-[1.8] mb-8"
                style={{
                  color: "rgba(250,246,238,0.6)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {featuredArticle.excerpt}
              </p>
              <Link
                href={`/newsroom/${featuredArticle.slug}`}
                className="inline-block px-7 py-3 font-sans text-[10px] uppercase tracking-[2px] font-bold text-[#050505] rounded-[2px] cursor-pointer transition-all duration-300 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                  border: "none",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Read Full Article →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3 — ALL ARTICLES GRID */}
      <section className="theme-bg-primary theme-text-primary py-20 px-[60px] max-md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-6"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            ALL ARTICLES
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
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

          <div
            ref={articlesGrid.ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] mt-8"
          >
            {filteredArticles.map((article, i) => (
              <div
                key={article.slug}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/newsroom/${article.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/newsroom/${article.slug}`);
                  }
                }}
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-[var(--border-gold-strong)]"
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  opacity: articlesGrid.visible[i] ? 1 : 0,
                  transform: articlesGrid.visible[i]
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition:
                    "opacity 700ms ease, transform 700ms ease, all 300ms ease",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="absolute bottom-4 left-4 px-3 py-1 font-sans text-[8px] uppercase tracking-[2px] text-[#C9A84C]"
                    style={{
                      background: "rgba(5,5,5,0.85)",
                      border: "1px solid var(--border-gold)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {article.category}
                  </div>
                </div>
                <div className="p-7">
                  <p
                    className="font-sans text-[10px] uppercase tracking-[2px] mb-2.5"
                    style={{
                      color: "rgba(201,168,76,0.5)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {article.date}
                  </p>
                  <h3
                    className="font-display font-medium text-[22px] text-[#FAF6EE] leading-[1.3] mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="font-sans text-[13px] font-light leading-[1.7] mb-5"
                    style={{
                      color: "rgba(250,246,238,0.55)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {article.excerpt}
                  </p>
                  <span
                    className="font-sans text-[10px] uppercase tracking-[2px] text-[#C9A84C]"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    Read More →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — NEWSLETTER SIGNUP */}
      <section
        ref={newsletter.ref}
        className="theme-bg-secondary theme-text-primary py-20 px-[60px] max-md:px-6 border-t transition-all duration-700 ease-out"
        style={{
          borderTopColor: "var(--border-subtle)",
          opacity: newsletter.visible ? 1 : 0,
          transform: newsletter.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[600px] mx-auto text-center">
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            STAY INFORMED
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE] mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 300,
            }}
          >
            Get the Latest from CLGB
          </h2>
          <p
            className="font-sans text-[14px] font-light mb-10"
            style={{
              color: "rgba(250,246,238,0.5)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Receive regulatory updates, market intelligence, and CLGB news
            directly in your inbox.
          </p>

          {newsletterSubscribed ? (
            <p
              className="font-sans text-[13px] text-[#C9A84C]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Thank you — you are subscribed.
            </p>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="theme-form flex flex-col sm:flex-row gap-0 max-w-[480px] mx-auto"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="theme-input flex-1 sm:border-r-0 px-5 py-3.5 font-sans text-[13px] outline-none transition-colors border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              />
              <button
                type="submit"
                className="bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-[#050505] px-7 py-3.5 font-sans text-[10px] uppercase tracking-[2px] font-bold border-none cursor-pointer whitespace-nowrap sm:rounded-r-[2px] rounded-b-[2px] sm:rounded-b-none"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
