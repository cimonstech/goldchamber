"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Press Release", "Regulatory", "Industry News", "Member Update"];

const inputBase =
  "w-full rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border bg-[#0a0a0a] border-[rgba(201,168,76,0.2)] text-[#FAF6EE] placeholder:text-[rgba(250,246,238,0.4)] focus:border-[var(--gold-primary)]";

type ArticleEditorProps = {
  articleId?: string | null;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    featured: boolean;
    body: string[];
    image_url: string | null;
    status: string;
  } | null;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ArticleEditor({ articleId, initialData }: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Press Release");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [body, setBody] = useState<string[]>(initialData?.body?.length ? [...initialData.body] : [""]);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [status, setStatus] = useState<"draft" | "published">((initialData?.status as "draft" | "published") ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData?.slug) setSlug(slugify(title));
  }, [title, initialData?.slug]);

  const addParagraph = () => setBody((p) => [...p, ""]);
  const removeParagraph = (i: number) => setBody((p) => (p.length <= 1 ? [""] : p.filter((_, j) => j !== i)));
  const setParagraph = (i: number, v: string) => setBody((p) => (p.map((x, j) => (j === i ? v : x))));

  const ensureUniqueSlug = async (s: string): Promise<string> => {
    const supabase = createClient();
    let candidate = s;
    let n = 0;
    while (true) {
      const { data } = await supabase.from("articles").select("id").eq("slug", candidate).maybeSingle();
      if (!data || (articleId && data.id === articleId)) return candidate;
      candidate = `${s}-${++n}`;
    }
  };

  const save = async (publish: boolean) => {
    setError(null);
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const finalStatus = publish ? "published" : "draft";
    const finalSlug = finalStatus === "published" ? await ensureUniqueSlug(slug || slugify(title)) : (slug || slugify(title));
    const payload: Record<string, unknown> = {
      title: title || "Untitled",
      slug: finalSlug,
      excerpt: excerpt || null,
      category,
      featured,
      body: body.filter((p) => p.trim()).length ? body.filter((p) => p.trim()) : [""],
      image_url: imageUrl.trim() || null,
      status: finalStatus,
      author_id: user?.id ?? null,
      updated_at: new Date().toISOString(),
    };
    if (finalStatus === "published") {
      payload.published_at = new Date().toISOString();
    }

    if (articleId) {
      const { error: err } = await supabase.from("articles").update(payload).eq("id", articleId);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      router.push("/admin/news");
    } else {
      const { data: inserted, error: err } = await supabase.from("articles").insert(payload).select("id").single();
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      router.push("/admin/news");
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title..."
        className="w-full border-0 bg-transparent px-0 py-2 mb-4 outline-none font-display"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 32,
          color: "#FAF6EE",
        }}
      />

      <div className="mb-6">
        <label
          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="article-slug"
          className={inputBase}
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        />
      </div>

      <div className="mb-6">
        <label
          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Excerpt
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={`${inputBase} resize-y`}
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        />
      </div>

      <div className="mb-6">
        <label
          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputBase}
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span
          className="font-sans text-[12px]"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Featured
        </span>
        <button
          type="button"
          onClick={() => setFeatured(!featured)}
          className="relative w-10 h-5 rounded-full transition-colors"
          style={{
            backgroundColor: featured ? "rgba(201,168,76,0.15)" : "rgba(250,246,238,0.2)",
          }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
            style={{ transform: featured ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
      </div>

      <div className="mb-6">
        <label
          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Body (paragraphs)
        </label>
        <div className="space-y-3">
          {body.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) => setParagraph(i, e.target.value)}
                rows={3}
                className={`${inputBase} flex-1 resize-y`}
                placeholder={`Paragraph ${i + 1}...`}
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              />
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                className="p-2 rounded hover:bg-[rgba(239,68,68,0.1)] transition-colors shrink-0"
                style={{ color: "#ef4444" }}
                aria-label="Remove paragraph"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addParagraph}
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded border transition-colors hover:bg-[rgba(201,168,76,0.08)]"
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
          Add paragraph
        </button>
      </div>

      <div className="mb-6">
        <label
          className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
          style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Image
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste URL..."
            className={`${inputBase} flex-1`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          />
          <label className="shrink-0 px-4 py-3 rounded border cursor-pointer font-sans text-[11px] uppercase tracking-[2px] font-semibold transition-colors hover:bg-[rgba(201,168,76,0.08)]" style={{ borderColor: "#C9A84C", color: "#C9A84C", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
            Upload
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file);
                const res = await fetch("/api/upload/media", { method: "POST", body: fd });
                if (res.ok) {
                  const { url } = await res.json();
                  setImageUrl(url);
                } else {
                  const err = await res.json().catch(() => ({}));
                  setError(err?.error ?? "Upload failed");
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {imageUrl && (
          <div className="mt-3 relative w-full h-40 rounded overflow-hidden bg-[#0a0a0a]">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        )}
      </div>

      {error && (
        <p className="mb-4 font-sans text-[13px]" style={{ color: "#ef4444", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
          {error}
        </p>
      )}

      {/* Right sidebar — publish panel */}
      <div
        className="rounded p-6"
        style={{ background: "#111111", border: "1px solid rgba(201,168,76,0.12)" }}
      >
        <h3
          className="font-display font-medium mb-4"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontSize: 16,
            color: "#C9A84C",
          }}
        >
          Publish
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-sans text-[12px]"
            style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Status
          </span>
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className={`px-3 py-1.5 rounded font-sans text-[11px] uppercase tracking-[1px] ${status === "draft" ? "bg-[rgba(250,246,238,0.15)] text-[#FAF6EE]" : ""}`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => setStatus("published")}
            className={`px-3 py-1.5 rounded font-sans text-[11px] uppercase tracking-[1px] ${status === "published" ? "bg-[rgba(34,197,94,0.15)] text-[#22c55e]" : ""}`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Published
          </button>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded border font-sans text-[11px] uppercase tracking-[2px] font-semibold disabled:opacity-50"
            style={{
              borderColor: "rgba(250,246,238,0.3)",
              color: "#FAF6EE",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded font-sans text-[11px] uppercase tracking-[2px] font-semibold disabled:opacity-50"
            style={{
              backgroundColor: "#C9A84C",
              color: "#050505",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
