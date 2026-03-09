"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() || undefined },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          className="text-center mb-4"
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
          className="text-center mb-8"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 13,
            color: "rgba(250,246,238,0.7)",
          }}
        >
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to verify your account and sign in.
        </p>
        <Link
          href="/auth/login"
          className="block w-full py-4 rounded-[2px] text-center transition-all duration-200"
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
        Create Account
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
        Join CLGB as a member
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
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputBase}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
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
        <div className="mb-6">
          <label
            className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
            style={{
              color: "rgba(250,246,238,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} pr-12`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p
            className="mt-1 font-sans text-[10px]"
            style={{ color: "rgba(250,246,238,0.4)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            At least 6 characters
          </p>
        </div>
        {error && (
          <div
            className="mb-6 flex items-start gap-3 p-4 rounded-[2px]"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
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
          className="w-full py-4 rounded-[2px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <p
        className="text-center mt-6 font-sans text-[12px]"
        style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#C9A84C] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
