import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";
import { ContactBanner } from "@/components/sections/ContactBanner";
import { ArticleShareSidebar } from "@/components/newsroom/ArticleShareSidebar";
import { MoreArticlesSection } from "@/components/newsroom/MoreArticlesSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chamberofgoldbuyers.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return {
    title: article ? `${article.title} — CLGB` : "Article — CLGB",
    description: article?.excerpt,
  };
}

export default async function NewsroomArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const otherArticles = articles.filter((a) => a.slug !== slug);
  const articleUrl = `${SITE_URL}/newsroom/${article.slug}`;

  return (
    <>
      {/* SECTION 1 — ARTICLE HERO */}
      <section className="relative min-h-[50vh] overflow-hidden flex items-end bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image
            src={article.image}
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
              "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.95) 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-[2] w-full px-[60px] max-md:px-6 pb-[60px]">
          <div className="max-w-[900px]">
            <p
              className="font-sans text-[9px] uppercase tracking-[3px] mb-4"
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              HOME · NEWSROOM · {article.category.toUpperCase()}
            </p>
            <span
              className="inline-block px-4 py-1.5 font-sans text-[8px] uppercase tracking-[2px] font-bold text-[#050505] mb-5"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              {article.category}
            </span>
            <h1
              className="font-display font-light text-[#FAF6EE] leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 300,
              }}
            >
              {article.title}
            </h1>
            <p
              className="font-sans text-[10px] uppercase tracking-[3px]"
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              {article.date}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ARTICLE BODY */}
      <section className="bg-[#050505] py-20 px-[60px] max-md:px-6">
        <div className="max-w-[1200px] mx-auto flex gap-16">
          <div className="flex-1 min-w-0 max-w-[800px]">
            <div className="lg:hidden mb-8">
              <ArticleShareSidebar url={articleUrl} title={article.title} />
            </div>
            <div className="space-y-7">
              {article.body.map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-[15px] font-light leading-[2]"
                  style={{
                    color: "rgba(250,246,238,0.72)",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    ...(i === 0 && {
                      // First letter drop cap
                    }),
                  }}
                >
                  {i === 0 ? (
                    <>
                      <span
                        className="float-left text-[4em] font-semibold leading-[0.8] mr-2 mt-1"
                        style={{
                          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                          color: "#C9A84C",
                        }}
                      >
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}
            </div>

            <div className="w-full h-px bg-[rgba(201,168,76,0.2)] my-12" />

            <div>
              <p
                className="font-sans text-[9px] uppercase tracking-[3px] mb-3"
                style={{
                  color: "rgba(201,168,76,0.5)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                PUBLISHED BY
              </p>
              <Image
                src="/primarylogo-white.png"
                alt="Chamber of Licensed Gold Buyers"
                width={120}
                height={40}
                className="object-contain object-left"
              />
              <p
                className="font-sans text-[12px] mt-2"
                style={{
                  color: "rgba(250,246,238,0.5)",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Chamber of Licensed Gold Buyers
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <ArticleShareSidebar url={articleUrl} title={article.title} />
          </div>
        </div>
      </section>

      {/* SECTION 3 — MORE ARTICLES */}
      <MoreArticlesSection articles={otherArticles} />

      {/* SECTION 4 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
