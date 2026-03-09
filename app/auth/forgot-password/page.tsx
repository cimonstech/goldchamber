"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/reset-password`
          : `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://chamberofgoldbuyers.com"}/auth/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="w-full max-w-[440px] rounded-[4px] p-12 text-center"
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
        <CheckCircle size={32} className="mx-auto mb-6" style={{ color: "#C9A84C" }} />
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontSize: 28,
            fontWeight: 300,
            color: "#FAF6EE",
          }}
        >
          Check your email
        </h1>
        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 13,
            color: "rgba(250,246,238,0.65)",
            lineHeight: 1.6,
          }}
        >
          We have sent a password reset link to your email address.
        </p>
        <Link
          href="/auth/login"
          className="inline-block font-sans text-[11px] uppercase tracking-[2px]"
          style={{
            color: "#C9A84C",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[440px] rounded-[4px] p-12"
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
      <h1
        className="text-center mb-2"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontSize: 36,
          fontWeight: 300,
          color: "#FAF6EE",
        }}
      >
        Reset Password
      </h1>
      <p
        className="text-center mb-8"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 11,
          color: "rgba(250,246,238,0.4)",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Enter your email and we will send you a reset link
      </p>
      <div
        className="w-full h-px mb-8"
        style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
      />
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
            style={{
              color: "rgba(250,246,238,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputBase}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        {error && (
          <div
            className="mb-6 p-4 rounded-[2px]"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <p
              className="font-sans text-[12px]"
              style={{
                color: "#ef4444",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              {error}
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-[2px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "var(--gold-gradient)",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#050505",
            border: "none",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <Link
        href="/auth/login"
        className="block text-center mt-6 font-sans text-[11px] uppercase tracking-[2px]"
        style={{
          color: "#C9A84C",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        }}
      >
        Back to Sign In
      </Link>
    </div>
  );
}
