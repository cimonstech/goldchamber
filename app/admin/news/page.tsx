"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Eye, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  draft: { bg: "rgba(250,246,238,0.15)", color: "rgba(250,246,238,0.6)", border: "rgba(250,246,238,0.2)" },
  published: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" },
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("articles")
      .select("id, slug, title, category, status, published_at, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setArticles((data ?? []) as Article[]);
        setLoading(false);
      });
  }, []);

  const toggleStatus = async (art: Article) => {
    setTogglingId(art.id);
    const supabase = createClient();
    const newStatus = art.status === "published" ? "draft" : "published";
    const payload: Record<string, unknown> = { status: newStatus };
    if (newStatus === "published") payload.published_at = new Date().toISOString();
    await supabase.from("articles").update(payload).eq("id", art.id);
    setArticles((prev) => prev.map((a) => (a.id === art.id ? { ...a, status: newStatus, published_at: newStatus === "published" ? new Date().toISOString() : null } : a)));
    setTogglingId(null);
  };

  const deleteArticle = async (id: string) => {
    const supabase = createClient();
    await supabase.from("articles").delete().eq("id", id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="p-[32px]">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="font-display font-light"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontSize: 28,
            color: "#FAF6EE",
          }}
        >
          News Management
        </h1>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded border transition-colors hover:bg-[rgba(201,168,76,0.08)]"
          style={{
            borderColor: "#C9A84C",
            color: "#C9A84C",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <Plus size={16} />
          New Article
        </Link>
      </div>

      <div
        className="rounded overflow-hidden"
        style={{
          background: "#111111",
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <table className="w-full">
          <thead>
            <tr
              className="font-sans text-[9px] uppercase tracking-[2px]"
              style={{
                color: "rgba(250,246,238,0.4)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                borderBottom: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Published Date</th>
              <th className="text-left py-3 px-4 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "rgba(201,168,76,0.06)" }}>
                  <td colSpan={5} className="p-4">
                    <div className="h-10 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
                  </td>
                </tr>
              ))
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center font-sans text-[13px]" style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  No articles yet.
                </td>
              </tr>
            ) : (
              articles.map((art) => (
                <tr
                  key={art.id}
                  className="border-b transition-colors hover:bg-[rgba(201,168,76,0.03)]"
                  style={{ borderColor: "rgba(201,168,76,0.06)" }}
                >
                  <td className="py-4 px-4">
                    <p className="font-sans text-[13px]" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                      {art.title}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="inline-block px-2.5 py-1 rounded font-sans text-[9px] uppercase"
                      style={{
                        backgroundColor: "rgba(201,168,76,0.15)",
                        color: "#C9A84C",
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      {art.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-[1px]"
                        style={{
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          backgroundColor: (STATUS_STYLES[art.status] ?? STATUS_STYLES.draft).bg,
                          color: (STATUS_STYLES[art.status] ?? STATUS_STYLES.draft).color,
                          border: `1px solid ${(STATUS_STYLES[art.status] ?? STATUS_STYLES.draft).border}`,
                        }}
                      >
                        {art.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStatus(art)}
                        disabled={togglingId === art.id}
                        className="relative w-10 h-5 rounded-full transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: art.status === "published" ? "rgba(34,197,94,0.4)" : "rgba(250,246,238,0.2)",
                        }}
                        aria-label={art.status === "published" ? "Unpublish" : "Publish"}
                      >
                        <span
                          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                          style={{
                            transform: art.status === "published" ? "translateX(20px)" : "translateX(0)",
                          }}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-sans text-[11px]" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                    {art.published_at ? new Date(art.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/news/${art.id}/edit`}
                        className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                        style={{ color: "#C9A84C" }}
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <a
                        href={`/newsroom/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                        style={{ color: "#C9A84C" }}
                        aria-label="View"
                      >
                        <Eye size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setDeleteId(art.id)}
                        className="p-2 rounded hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                        style={{ color: "#ef4444" }}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setDeleteId(null)}>
          <div
            className="max-w-md w-full mx-4 p-6 rounded"
            style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-sans text-[14px] mb-6" style={{ color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Are you sure you want to delete this article?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded border font-sans text-[12px]"
                style={{ borderColor: "rgba(250,246,238,0.3)", color: "#FAF6EE", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteArticle(deleteId)}
                className="px-4 py-2 rounded font-sans text-[12px] font-semibold"
                style={{ backgroundColor: "#ef4444", color: "#fff", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
