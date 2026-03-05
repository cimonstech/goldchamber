"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center p-8">
      <h1 className="font-display text-2xl text-gold mb-4">Something went wrong</h1>
      <pre className="font-sans text-sm text-cream/80 whitespace-pre-wrap max-w-2xl mb-6">
        {error.message}
      </pre>
      <button
        onClick={reset}
        className="font-sans text-xs font-semibold uppercase tracking-wider px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-dark transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
