/**
 * Fetch published articles from Supabase (for public newsroom).
 * Uses public client (no cookies) so it works in generateStaticParams and other non-request contexts.
 */
import { createPublicSupabaseClient } from "@/lib/supabase/public";

export type DbArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string[];
  category: string;
  image_url: string | null;
  featured: boolean;
  published_at: string | null;
};

export type ArticleForNewsroom = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  month: string;
  year: string;
  category: string;
  image: string;
  featured: boolean;
};

function formatDate(iso: string | null): { date: string; month: string; year: string } {
  if (!iso) return { date: "—", month: "—", year: "—" };
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    month: months[d.getMonth()],
    year: String(d.getFullYear()),
  };
}

export async function getPublishedArticles(): Promise<ArticleForNewsroom[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, excerpt, body, category, image_url, featured, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];

  const formatted = (data ?? []).map((a: DbArticle) => {
    const { date, month, year } = formatDate(a.published_at);
    return {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? "",
      body: Array.isArray(a.body) ? a.body : [],
      date,
      month,
      year,
      category: a.category,
      image: a.image_url ?? "/gold-bars.jpg",
      featured: a.featured ?? false,
    };
  });

  return formatted;
}

export async function getPublishedArticleBySlug(slug: string): Promise<ArticleForNewsroom | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, excerpt, body, category, image_url, featured, published_at")
    .eq("status", "published")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const a = data as DbArticle;
  const { date, month, year } = formatDate(a.published_at);
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? "",
    body: Array.isArray(a.body) ? a.body : [],
    date,
    month,
    year,
    category: a.category,
    image: a.image_url ?? "/gold-bars.jpg",
    featured: a.featured ?? false,
  };
}
