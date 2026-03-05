import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";

const articles: Record<
  string,
  { title: string; date: string; category: string; body: string; image: string }
> = {
  "press-release-oct-2025": {
    title: "Press Release — 23rd October 2025",
    date: "23 Oct 2025",
    category: "Press Release",
    image: "/gold-bars.jpg",
    body: "The latest official communication from the Chamber of Licensed Gold Buyers. Full text to be populated from existing site content.",
  },
  "goldbod-receipts-enforcement": {
    title: "GoldBod Begins Reinforcement of GoldBod Receipts",
    date: "Oct 2025",
    category: "Regulatory",
    image: "/gold-bars2.jpg",
    body: "The Ghana Gold Board has begun enforcing the mandatory use of GoldBod receipts by all licensed gold buyers. CLGB members are advised on compliance requirements. Full article content to be populated.",
  },
  "june-21-deadline": {
    title: "No More Extensions After June 21 Deadline",
    date: "Jun 2025",
    category: "Industry News",
    image: "/goldbars3.jpeg",
    body: "GoldBod has issued a final warning to unlicensed traders following the June 21 licensing deadline. CLGB outlines what members need to know. Full article content to be populated.",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: "News — CLGB" };
  return {
    title: `${article.title} — Chamber of Licensed Gold Buyers`,
    description: article.body.slice(0, 160),
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <>
      <PageHero
        title={article.title}
        subtitle={`${article.date} · ${article.category}`}
      />
      <div className="pt-10 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/newsroom"
            className="inline-block font-sans text-sm text-gold hover:underline mb-8"
          >
            ← Back to News Room
          </Link>
          <h1 className="font-display text-h2 text-cream font-light mb-8 sr-only">
            {article.title}
          </h1>
          <div className="relative aspect-video bg-dark-2 mb-10">
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-sans text-cream/80 leading-relaxed space-y-4">
            <p>{article.body}</p>
          </div>
        </div>
      </div>
    </>
  );
}
