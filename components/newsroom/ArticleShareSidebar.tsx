"use client";

import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin, Link2 } from "lucide-react";

export function ArticleShareSidebar({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers
    }
  };

  return (
    <aside className="hidden lg:block sticky top-24 w-full max-w-[280px] shrink-0">
      <div className="mb-8">
        <p
          className="font-sans text-[10px] uppercase tracking-[4px] mb-4"
          style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          SHARE
        </p>
        <div className="flex gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-social-link w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-colors"
            style={{ borderColor: "var(--input-border)", color: "var(--gold-primary)" }}
            aria-label="Share on X"
          >
            <Twitter size={18} />
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-social-link w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
            style={{ borderColor: "var(--input-border)", color: "var(--gold-primary)" }}
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="theme-social-link w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
            style={{ borderColor: "var(--input-border)", color: "var(--gold-primary)" }}
            aria-label="Copy link"
          >
            <Link2 size={18} />
          </button>
        </div>
      </div>
      <Link
        href="/newsroom"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[2px] hover:underline"
        style={{ color: "var(--gold-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        <ArrowLeft size={14} />
        Newsroom
      </Link>
    </aside>
  );
}
