"use client";

/**
 * Auth callback — handles invite/magic link redirect from Supabase.
 * Processes code (PKCE) or hash (implicit), then redirects to set-password.
 */
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/auth/set-password";

    const run = async () => {
      const supabase = createClient();

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeError) {
          router.replace(next);
          return;
        }
        setError(exchangeError.message);
        return;
      }

      // Hash flow (implicit) — client auto-parses hash on load
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
        return;
      }

      setError("Invalid or expired link");
    };

    run();
  }, [searchParams, router]);

  if (error) {
    return (
      <div
        className="w-full max-w-[440px] rounded-[4px] p-12 mx-auto"
        style={{
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.2)",
        }}
      >
        <Image
          src="/primarylogo-white.png"
          alt="CLGB"
          width={140}
          height={40}
          className="block mx-auto mb-8"
        />
        <p
          className="text-center font-sans text-[14px]"
          style={{
            color: "#ef4444",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          {error}
        </p>
        <a
          href="/auth/set-password"
          className="block text-center mt-6 font-sans text-[12px] text-[#C9A84C] hover:underline"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Try again
        </a>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[440px] rounded-[4px] p-12 mx-auto"
      style={{
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.2)",
      }}
    >
      <Image
        src="/primarylogo-white.png"
        alt="CLGB"
        width={140}
        height={40}
        className="block mx-auto mb-8"
      />
      <div className="flex items-center justify-center gap-3 py-12">
        <Loader2 size={24} className="animate-spin" style={{ color: "#C9A84C" }} />
        <span
          className="font-sans text-[14px]"
          style={{
            color: "rgba(250,246,238,0.7)",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          Verifying your invitation...
        </span>
      </div>
    </div>
  );
}
