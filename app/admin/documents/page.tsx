"use client";

import { useEffect, useState } from "react";
import { FileText, Upload, Loader2 } from "lucide-react";

const CATEGORIES = ["Licensing", "Compliance", "Guidelines", "Forms"];

type Document = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: string | null;
  category: string;
  created_at: string;
};

const inputBase =
  "w-full rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none border bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)]";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Licensing");
  const [file, setFile] = useState<File | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/documents");
    if (res.ok) {
      const { data } = await res.json();
      setDocuments(data ?? []);
    } else {
      setDocuments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const uploadRes = await fetch("/api/upload/document", { method: "POST", body: fd });
    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}));
      alert(err?.error ?? "Upload failed");
      setUploading(false);
      return;
    }
    const { url, size } = await uploadRes.json();
    const insertRes = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        file_url: url,
        file_size: size ? `${(size / 1024).toFixed(1)} KB` : null,
        category,
      }),
    });
    if (!insertRes.ok) {
      const err = await insertRes.json().catch(() => ({}));
      alert(err?.error ?? "Failed to save document");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Licensing");
      setFile(null);
      fetchDocuments();
    }
    setUploading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1
        className="font-display font-light mb-8"
        style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 28, color: "var(--text-primary)" }}
      >
        Documents
      </h1>

      <form onSubmit={handleUpload} className="mb-12 p-6 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
        <h2 className="font-display font-light mb-4" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}>
          Upload Document
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputBase} placeholder="Document title" required />
          </div>
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputBase}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${inputBase} resize-y`} placeholder="Optional description" />
        </div>
        <div className="mt-4">
          <label className="block font-sans text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>File (PDF, Word, images)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.csv,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={inputBase}
            required
          />
          {file && <p className="mt-2 font-sans text-[12px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{file.name}</p>}
        </div>
        <button
          type="submit"
          disabled={uploading || !file || !title.trim()}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded font-sans text-[11px] uppercase tracking-[2px] font-semibold disabled:opacity-50"
          style={{ backgroundColor: "var(--gold-primary)", color: "var(--bg-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading..." : "Upload to R2"}
        </button>
      </form>

      <h2 className="font-display font-light mb-4" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 18, color: "var(--gold-primary)" }}>
        Document Library
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded bg-[var(--gold-glow)]" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <p className="font-sans text-[14px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
          No documents yet. Upload one above.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded flex items-start gap-3"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}
            >
              <FileText size={24} style={{ color: "var(--gold-primary)", flexShrink: 0 }} />
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-light truncate" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontSize: 16, color: "var(--text-primary)" }}>{doc.title}</h3>
                <p className="font-sans text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{doc.category} {doc.file_size && `· ${doc.file_size}`}</p>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] uppercase tracking-[1px] mt-2 inline-block" style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
