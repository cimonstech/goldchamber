"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full theme-input rounded-[2px] px-[18px] py-[14px] font-sans text-[14px] outline-none transition-all duration-200 border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold-primary)] focus:shadow-[0_0_0_3px_var(--gold-glow)]";

function meetsRequirements(password: string): { length: boolean; upper: boolean; number: boolean } {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
  };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reqs = meetsRequirements(password);
  const allMet = reqs.length && reqs.upper && reqs.number;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allMet) {
      setError("Password does not meet the requirements below.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      router.push("/auth/login?success=password-reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
        Set New Password
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
        Choose a secure password
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
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
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
            className="mt-2 font-sans text-[11px]"
            style={{
              color: "rgba(250,246,238,0.4)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            • At least 8 characters
            <br />
            • One uppercase letter
            <br />• One number
          </p>
        </div>
        <div className="mb-6">
          <label
            className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
            style={{
              color: "rgba(250,246,238,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBase} pr-12`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
          disabled={loading || !allMet || !passwordsMatch}
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
          {loading ? "Updating..." : "Update Password"}
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
