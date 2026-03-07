import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "News Room",
  description: "Regulatory updates, industry news, and press releases from the Chamber of Licensed Gold Buyers.",
  openGraph: {
    title: "News Room — Chamber of Licensed Gold Buyers",
    description: "Regulatory updates, industry news, and press releases.",
  },
};

const articles = [
  {
    slug: "press-release-oct-2025",
    title: "Press Release — 23rd October 2025",
    excerpt: "The latest official communication from the Chamber of Licensed Gold Buyers.",
    date: "23 Oct 2025",
    category: "Press Release",
    image: "/gold-bars.jpg",
    featured: true,
  },
  {
    slug: "goldbod-receipts-enforcement",
    title: "GoldBod Begins Reinforcement of GoldBod Receipts",
    excerpt: "The Ghana Gold Board has begun enforcing the mandatory use of GoldBod receipts by all licensed gold buyers. CLGB members are advised on compliance requirements.",
    date: "Oct 2025",
    category: "Regulatory",
    image: "/gold-bars2.jpg",
    featured: false,
  },
  {
    slug: "june-21-deadline",
    title: "No More Extensions After June 21 Deadline",
    excerpt: "GoldBod has issued a final warning to unlicensed traders following the June 21 licensing deadline. CLGB outlines what members need to know.",
    date: "Jun 2025",
    category: "Industry News",
    image: "/goldbars3.jpeg",
    featured: false,
  },
];

const categories = ["All", "Regulatory", "Industry News", "Press Releases", "Events"];

export default function NewsroomPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <PageHero
        label="News"
        title="News Room"
        subtitle="Regulatory developments, industry news, and CLGB press releases."
      />
      <div className="py-section md:py-section-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="font-sans text-xs uppercase tracking-wider px-4 py-2 border border-gold/40 text-cream/80 hover:border-gold hover:text-gold transition-all duration-200 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm cursor-pointer"
            >
              {c}
            </button>
          ))}
        </div>
        {featured && (
          <Link
            href={`/newsroom/${featured.slug}`}
            className="block border border-gold/20 overflow-hidden mb-12 group"
          >
            <div className="aspect-[21/9] relative bg-dark-2">
              <Image
                src={featured.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="p-8 border-t border-gold/20">
              <p className="font-sans text-xs text-gold uppercase tracking-wider mb-2">
                {featured.date} · {featured.category}
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-cream font-light group-hover:text-gold-light transition-colors">
                {featured.title}
              </h2>
              <p className="font-sans text-cream/70 mt-2">{featured.excerpt}</p>
            </div>
          </Link>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/newsroom/${article.slug}`}
              className="group block border border-gold/20 overflow-hidden hover:border-gold/40 transition-colors"
            >
              <div className="aspect-[16/10] relative bg-dark-2">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="p-6 border-t border-gold/20">
                <p className="font-sans text-xs text-gold uppercase tracking-wider mb-1">
                  {article.date} · {article.category}
                </p>
                <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold-light transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-cream/70 line-clamp-2 mt-1">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </>
  );
}
