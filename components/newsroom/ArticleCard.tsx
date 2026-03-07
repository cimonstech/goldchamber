import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/newsroom/${article.slug}`}
      className="group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      style={{
        background: "#111111",
        border: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={article.image}
          alt=""
          fill
          className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className="absolute bottom-4 left-4 px-3 py-1 font-sans text-[8px] uppercase tracking-[2px] text-[#C9A84C]"
          style={{
            background: "rgba(5,5,5,0.85)",
            border: "1px solid rgba(201,168,76,0.3)",
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
    </Link>
  );
}
