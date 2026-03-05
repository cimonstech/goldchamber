"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const articles = [
  {
    slug: "press-release-oct-2025",
    title: "Press Release — 23rd October 2025",
    excerpt: "The latest official communication from the Chamber of Licensed Gold Buyers.",
    date: "23 Oct 2025",
    category: "Press Release",
    image: "/gold-bars.jpg",
  },
  {
    slug: "goldbod-receipts-enforcement",
    title: "GoldBod Begins Reinforcement of GoldBod Receipts",
    excerpt: "The Ghana Gold Board has begun enforcing the mandatory use of GoldBod receipts by all licensed gold buyers.",
    date: "Oct 2025",
    category: "Regulatory",
    image: "/gold-bars2.jpg",
  },
  {
    slug: "june-21-deadline",
    title: "No More Extensions After June 21 Deadline",
    excerpt: "GoldBod has issued a final warning to unlicensed traders following the June 21 licensing deadline.",
    date: "Jun 2025",
    category: "Industry News",
    image: "/goldbars3.jpeg",
  },
];

export function NewsPreview() {
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
        "relative z-10 py-section md:py-section-md sm:py-section-sm transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="font-display text-h1 text-white font-light">
            News & Insights
          </h2>
          <Link
            href="/newsroom"
            className="font-sans text-sm font-semibold uppercase tracking-wider text-gold hover:underline"
          >
            View All News
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/newsroom/${article.slug}`}
              className="group block border border-gold/20 overflow-hidden hover:border-gold/40 transition-colors"
            >
              <div className="aspect-[16/10] relative bg-dark-2">
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="p-6 border-t border-gold/20">
                <p className="font-sans text-xs text-gold uppercase tracking-wider mb-1">
                  {article.date} · {article.category}
                </p>
                <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-white/75 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="inline-block mt-3 font-sans text-xs font-semibold uppercase tracking-wider text-gold">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
