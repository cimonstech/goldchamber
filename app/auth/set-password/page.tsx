"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
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

export default function SetPasswordPage() {
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reqs = meetsRequirements(password);
  const allMet = reqs.length && reqs.upper && reqs.number;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    const supabase = createClient();
    const hasHash = typeof window !== "undefined" && !!window.location.hash;

    if (!hasHash) {
      setTokenValid(false);
      return;
    }

    let resolved = false;
    const resolve = (valid: boolean) => {
      if (!resolved) {
        resolved = true;
        setTokenValid(valid);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "INITIAL_SESSION" && session)) {
        resolve(true);
      }
    });

    // Check immediately — hash may already be processed
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) resolve(true);
    });

    // Timeout: if no valid session after 3s, link may be expired
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session && !resolved) resolve(false);
      });
    }, 3000);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

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

      router.push("/portal/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading/checking state
  if (tokenValid === null) {
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
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: "#C9A84C" }} />
          <span
            className="font-sans text-[14px]"
            style={{
              color: "rgba(250,246,238,0.7)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Verifying link...
          </span>
        </div>
      </div>
    );
  }

  // Invalid/expired link
  if (!tokenValid) {
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
        <p
          className="text-center font-sans text-[14px]"
          style={{
            color: "#ef4444",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          This link has expired or is invalid. Please contact CLGB at{" "}
          <a
            href="mailto:info@chamberofgoldbuyers.com"
            className="text-[#C9A84C] hover:underline"
          >
            info@chamberofgoldbuyers.com
          </a>{" "}
          to request a new link.
        </p>
      </div>
    );
  }

  // Valid token — show password form
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
        Welcome to CLGB
      </h1>
      <p
        className="text-center mb-8"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 12,
          color: "rgba(250,246,238,0.55)",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Your membership has been approved. Create your password to access your member portal.
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
            New Password
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
        </div>
        <div className="mb-6">
          <label
            className="block font-sans text-[10px] uppercase tracking-[2px] mb-2"
            style={{
              color: "rgba(250,246,238,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Confirm Password
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
        <div
          className="mb-6 font-sans text-[11px] space-y-1"
          style={{
            color: "rgba(250,246,238,0.4)",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          <div className="flex items-center gap-2">
            {reqs.length ? (
              <CheckCircle size={14} style={{ color: "#22c55e" }} />
            ) : (
              <span className="w-3.5" />
            )}
            <span style={{ color: reqs.length ? "#22c55e" : undefined }}>At least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            {reqs.upper ? (
              <CheckCircle size={14} style={{ color: "#22c55e" }} />
            ) : (
              <span className="w-3.5" />
            )}
            <span style={{ color: reqs.upper ? "#22c55e" : undefined }}>At least one uppercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            {reqs.number ? (
              <CheckCircle size={14} style={{ color: "#22c55e" }} />
            ) : (
              <span className="w-3.5" />
            )}
            <span style={{ color: reqs.number ? "#22c55e" : undefined }}>At least one number</span>
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
          className="w-full py-4 rounded-[2px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #8B6914)",
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
              Creating...
            </>
          ) : (
            "Create Password & Enter Portal"
          )}
        </button>
      </form>
    </div>
  );
}
