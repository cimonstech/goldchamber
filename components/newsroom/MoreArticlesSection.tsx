"use client";

import { useEffect, useRef, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/lib/articles";

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

export function MoreArticlesSection({ articles }: { articles: Article[] }) {
  const grid = useFadeUpStagger(articles.length, 0.15, 150);

  return (
    <section className="bg-[#F8F8F8] py-20 px-[60px] max-md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <p
          className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-10"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          MORE FROM CLGB
        </p>
        <div
          ref={grid.ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {articles.map((a, i) => (
            <div
              key={a.slug}
              style={{
                opacity: grid.visible[i] ? 1 : 0,
                transform: grid.visible[i] ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 700ms ease, transform 700ms ease",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
