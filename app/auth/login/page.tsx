"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

type LoginError = "invalid" | "suspended" | "pending";

const ERROR_MESSAGES: Record<LoginError, string> = {
  invalid: "Invalid email or password. Please try again.",
  suspended: "Your account has been suspended. Please contact CLGB.",
  pending: "Your application is still under review.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successReset = searchParams.get("success") === "password-reset";
  const reasonRejected = searchParams.get("reason") === "rejected";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid") || signInError.message.includes("invalid")) {
          setError("invalid");
        } else {
          setError("invalid");
        }
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("invalid");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership_status")
        .eq("id", data.user.id)
        .single();

      if (profile?.membership_status === "suspended") {
        await supabase.auth.signOut();
        setError("suspended");
        setLoading(false);
        return;
      }

      if (profile?.membership_status === "pending" && profile?.role === "member") {
        await supabase.auth.signOut();
        setError("pending");
        setLoading(false);
        return;
      }

      // Fallback: admin@chamberofgoldbuyers.com is always admin (in case profile.role is stale)
      const isAdmin = profile?.role === "admin" || data.user.email === "admin@chamberofgoldbuyers.com";
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/portal/dashboard");
      }
    } catch {
      setError("invalid");
    } finally {
      setLoading(false);
    }
  };

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
        Sign In
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
        Access your CLGB portal
      </p>
      <div
        className="w-full h-px mb-8"
        style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
      />
      {successReset && (
        <div
          className="mb-6 p-4 rounded-[2px]"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <p
            className="font-sans text-[12px]"
            style={{
              color: "#22c55e",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Your password has been updated. You can now sign in.
          </p>
        </div>
      )}
      {reasonRejected && (
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
            Your membership application was not approved. Please contact CLGB for more information.
          </p>
        </div>
      )}
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
        <div className="mb-2">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} pr-12`}
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>
        <Link
          href="/auth/forgot-password"
          className="block text-right mt-[-12px] mb-6"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            color: "#C9A84C",
          }}
        >
          Forgot password?
        </Link>
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
              {ERROR_MESSAGES[error]}
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <p
        className="text-center mt-6 font-sans text-[12px]"
        style={{ color: "rgba(250,246,238,0.5)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-[#C9A84C] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
