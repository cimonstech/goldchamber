"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default function AdminNewsEditPage() {
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    featured: boolean;
    body: string[];
    image_url: string | null;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("articles")
      .select("title, slug, excerpt, category, featured, body, image_url, status")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setInitialData(null);
        } else {
          setInitialData({
            title: data.title ?? "",
            slug: data.slug ?? "",
            excerpt: data.excerpt ?? "",
            category: data.category ?? "Press Release",
            featured: data.featured ?? false,
            body: Array.isArray(data.body) && data.body.length ? data.body : [""],
            image_url: data.image_url ?? null,
            status: data.status ?? "draft",
          });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-12 w-64 animate-pulse rounded bg-[rgba(250,246,238,0.08)] mb-8" />
        <div className="h-96 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="p-8">
        <p className="font-sans text-[14px]" style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
          Article not found.
        </p>
      </div>
    );
  }

  return <ArticleEditor articleId={id} initialData={initialData} />;
}
