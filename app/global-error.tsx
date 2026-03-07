"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050505] text-[#FAF6EE] flex flex-col items-center justify-center p-8 font-sans">
        <h1 className="text-2xl text-[#C9A84C] mb-4 font-semibold">Something went wrong</h1>
        <p className="text-sm text-[#FAF6EE]/80 max-w-md mb-6 text-center">
          The page encountered an error. This can sometimes be caused by browser extensions (e.g. React DevTools, ad blockers).
        </p>
        <button
          onClick={reset}
          className="text-xs font-semibold uppercase tracking-wider px-6 py-3 border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#050505] transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="mt-4 text-xs text-[#C9A84C]/80 hover:text-[#C9A84C] underline"
        >
          Return home
        </a>
      </body>
    </html>
  );
}
