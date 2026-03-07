"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: "Gold" | "Members" | "Events";
  span?: "wide" | "tall" | "normal";
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: "/gold-bars.jpg",
    alt: "Gold bars arranged in a vault",
    caption: "CLGB Certified Gold — London Good Delivery Standard",
    category: "Gold",
    span: "wide",
  },
  {
    id: "2",
    src: "/gold-bars2.jpg",
    alt: "Gold bars close up",
    caption: "999.9 Fine Gold — Ethically Sourced in Ghana",
    category: "Gold",
    span: "normal",
  },
  {
    id: "3",
    src: "/goldbars3.jpeg",
    alt: "Gold bars stacked",
    caption: "Ghana's Gold — The World's Standard",
    category: "Gold",
    span: "normal",
  },
  {
    id: "4",
    src: "/golds.jpg",
    alt: "Gold collection",
    caption: "CLGB Member Gold Holdings",
    category: "Gold",
    span: "wide",
  },
  {
    id: "5",
    src: "/members/person1.webp",
    alt: "CLGB Member",
    caption: "CLGB Certified Member — Licensed Gold Buyer",
    category: "Members",
    span: "normal",
  },
  {
    id: "6",
    src: "/members/person2.webp",
    alt: "CLGB Member",
    caption: "CLGB Certified Member — Corporate Trader",
    category: "Members",
    span: "normal",
  },
  {
    id: "7",
    src: "/members/person3.webp",
    alt: "CLGB Member",
    caption: "CLGB Certified Member — Mining Professional",
    category: "Members",
    span: "normal",
  },
  {
    id: "8",
    src: "/members/person4.webp",
    alt: "CLGB Member",
    caption: "CLGB Certified Member — Financial Institution",
    category: "Members",
    span: "normal",
  },
  {
    id: "9",
    src: "/members/person5.webp",
    alt: "CLGB Member",
    caption: "CLGB Certified Member — Gold Trader",
    category: "Members",
    span: "normal",
  },
  {
    id: "10",
    src: "/members/person6.webp",
    alt: "CLGB Member",
    caption: "CLGB Certified Member — Independent Buyer",
    category: "Members",
    span: "normal",
  },
  {
    id: "11",
    src: "/founder.webp",
    alt: "Job Osei Tutu — Founder CLGB",
    caption: "Job Osei Tutu — Founder, Chamber of Licensed Gold Buyers",
    category: "Events",
    span: "tall",
  },
  {
    id: "12",
    src: "/co-founder-pic.webp",
    alt: "Daniel Boateng Sarpong — Co-Founder CLGB",
    caption: "Daniel Boateng Sarpong — Co-Founder, Chamber of Licensed Gold Buyers",
    category: "Events",
    span: "normal",
  },
  {
    id: "13",
    src: "/AG.CEO.webp",
    alt: "Kwaku Amoah — Acting CEO CLGB",
    caption: "Kwaku Amoah — Acting CEO, Chamber of Licensed Gold Buyers",
    category: "Events",
    span: "normal",
  },
];

const CATEGORIES = ["All", "Gold", "Members", "Events"];

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

function useFadeUpStagger(count: number, threshold = 0.15, delay = 50) {
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

export default function GalleryPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxMounted, setLightboxMounted] = useState(false);

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const gallerySection = useFadeUpStagger(filtered.length, 0.15, 50);
  const submitSection = useFadeUp(0.15);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
      setLightboxMounted(true);
    } else {
      document.body.style.overflow = "";
      setLightboxMounted(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextItem = () => {
    setLightboxIndex((prev) => (prev + 1) % filtered.length);
  };

  const prevItem = () => {
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, lightboxIndex, filtered.length]);

  const currentItem = filtered[lightboxIndex];

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative min-h-[50vh] overflow-hidden flex items-center justify-center bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/goldbars3.jpeg"
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
              "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.92) 100%)",
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
              color: "rgba(201,168,76,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            HOME · GALLERY
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
            Gallery
          </h1>
          <div className="w-[60px] h-px bg-[#C9A84C] mx-auto my-6" />
          <p
            className="font-display italic mx-auto max-w-[500px]"
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
            Moments from Ghana&apos;s gold trading community.
          </p>
        </div>
      </section>

      {/* SECTION 2 — GALLERY GRID */}
      <section className="bg-[#050505] py-20 px-[60px] max-md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
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
                        background: "#C9A84C",
                        color: "#050505",
                        borderColor: "#C9A84C",
                        fontWeight: 700,
                      }
                    : {
                        background: "transparent",
                        color: "rgba(250,246,238,0.5)",
                        borderColor: "rgba(201,168,76,0.2)",
                      }),
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            ref={gallerySection.ref}
            className="grid gap-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{
              gridAutoRows: "280px",
            }}
          >
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden cursor-pointer transition-opacity duration-300 ${
                  item.span === "wide" ? "col-span-1 sm:col-span-2" : ""
                } ${item.span === "tall" ? "row-span-1 sm:row-span-2" : ""}`}
                style={{
                  opacity: gallerySection.visible[i] ? 1 : 0,
                  transform: gallerySection.visible[i]
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition:
                    "opacity 700ms ease, transform 700ms ease",
                  transitionDelay: `${i * 50}ms`,
                }}
                onClick={() => {
                  const idx = filtered.findIndex((f) => f.id === item.id);
                  openLightbox(idx >= 0 ? idx : 0);
                }}
              >
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-[rgba(5,5,5,0)] transition-colors duration-[400ms] group-hover:bg-[rgba(5,5,5,0.4)] z-[1]"
                  aria-hidden
                />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 font-sans text-[8px] uppercase tracking-[2px] text-[#C9A84C] z-[2]"
                  style={{
                    background: "rgba(5,5,5,0.7)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {item.category}
                </span>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(5,5,5,0.9)] to-transparent z-[2] p-5 pt-4 pb-4 translate-y-full transition-transform duration-[400ms] group-hover:translate-y-0"
                >
                  <p
                    className="font-sans text-[11px] letter-spacing-[1px]"
                    style={{
                      color: "rgba(250,246,238,0.8)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(5,5,5,0.96)]"
          style={{
            opacity: lightboxMounted ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 p-2 cursor-pointer text-[#FAF6EE] hover:text-[#C9A84C] transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevItem();
              }}
              className="absolute -left-16 top-1/2 -translate-y-1/2 hidden lg:flex cursor-pointer text-[rgba(250,246,238,0.4)] hover:text-[#C9A84C] transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextItem();
              }}
              className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:flex cursor-pointer text-[rgba(250,246,238,0.4)] hover:text-[#C9A84C] transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
            {currentItem && (
              <>
                <div className="relative w-full max-w-[90vw] max-h-[80vh] flex items-center justify-center">
                  <Image
                    src={currentItem.src}
                    alt={currentItem.alt}
                    width={1200}
                    height={800}
                    className="object-contain max-w-[90vw] max-h-[80vh] w-auto h-auto"
                  />
                </div>
                <p
                  className="font-sans text-[12px] text-center mt-4"
                  style={{
                    color: "rgba(250,246,238,0.6)",
                    letterSpacing: "1px",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {currentItem.caption}
                </p>
              </>
            )}
            <div className="flex lg:hidden gap-4 mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevItem();
                }}
                className="p-2 cursor-pointer text-[rgba(250,246,238,0.4)] hover:text-[#C9A84C] transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextItem();
                }}
                className="p-2 cursor-pointer text-[rgba(250,246,238,0.4)] hover:text-[#C9A84C] transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3 — SUBMIT YOUR PHOTO */}
      <section
        ref={submitSection.ref}
        className="bg-[#0a0a0a] py-20 px-[60px] max-md:px-6 border-t border-[rgba(201,168,76,0.12)] transition-all duration-700 ease-out"
        style={{
          opacity: submitSection.visible ? 1 : 0,
          transform: submitSection.visible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-[600px] mx-auto text-center">
          <Camera
            size={32}
            className="mx-auto mb-5"
            style={{ color: "#C9A84C" }}
          />
          <p
            className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            CONTRIBUTE TO THE GALLERY
          </p>
          <h2
            className="font-display font-light text-[#FAF6EE] mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 300,
            }}
          >
            Are You a CLGB Member?
          </h2>
          <p
            className="font-sans text-[14px] font-light leading-[1.8] mb-8"
            style={{
              color: "rgba(250,246,238,0.55)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Share your photos with the CLGB community. Members are encouraged to
            submit photos from events, trading activities, and milestones for
            inclusion in the gallery.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-[#C9A84C] bg-transparent text-[#C9A84C] py-3 px-8 font-sans text-[10px] uppercase tracking-[2px] transition-all duration-300 hover:bg-[#C9A84C] hover:text-[#050505]"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Get in Touch →
          </Link>
        </div>
      </section>

      {/* SECTION 4 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
