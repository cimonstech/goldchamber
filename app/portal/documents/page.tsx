"use client";

import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Document = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: string | null;
  category: string;
};

const CATEGORIES = ["All", "Licensing", "Compliance", "Guidelines", "Forms"];

const cardStyle = {
  background: "var(--bg-card-solid)",
  border: "1px solid var(--border-gold)",
  backdropFilter: "var(--card-backdrop)",
  WebkitBackdropFilter: "var(--card-backdrop)",
  boxShadow: "0 8px 32px var(--shadow-gold), inset 0 1px 0 var(--border-gold)",
} as const;

export default function PortalDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("documents")
      .select("id, title, description, file_url, file_size, category")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setDocuments((data ?? []) as Document[]);
        setLoading(false);
      });
  }, []);

  const filtered = documents.filter((d) => {
    const matchSearch = !search.trim() || d.title.toLowerCase().includes(search.toLowerCase()) || (d.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-8">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        Documents
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="flex-1 max-w-md rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border input-dashboard"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "font-sans text-[10px] uppercase tracking-[2px] py-2 px-5 border cursor-pointer transition-all",
                category === c
                  ? "bg-[var(--gold-primary)] text-[var(--bg-primary)] border-[var(--gold-primary)] font-bold"
                  : "bg-transparent text-[rgba(250,246,238,0.5)] border-[rgba(201,168,76,0.3)]"
              )}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded bg-[rgba(250,246,238,0.08)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText size={48} style={{ color: "rgba(201,168,76,0.4)", marginBottom: 16 }} />
          <p
            className="font-display font-light max-w-md"
            style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "var(--text-primary)" }}
          >
            Document library coming soon. Check back for regulatory documents, compliance guides, and GoldBod forms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded transition-all duration-300 hover:-translate-y-1"
              style={cardStyle}
            >
              <FileText size={32} className="mb-4" style={{ color: "var(--gold-primary)" }} />
              <h3
                className="font-display font-light mb-2"
                style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 20, color: "var(--text-primary)" }}
              >
                {doc.title}
              </h3>
              <p
                className="font-sans text-[12px] mb-3 line-clamp-2"
                style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {doc.description ?? "—"}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-block px-2 py-0.5 rounded font-sans text-[9px] uppercase"
                  style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {doc.category}
                </span>
                {doc.file_size && (
                  <span className="font-sans text-[10px]" style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                    {doc.file_size}
                  </span>
                )}
              </div>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded border transition-colors hover:bg-[rgba(201,168,76,0.08)]"
                style={{ borderColor: "#C9A84C", color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}
              >
                <Download size={14} />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
