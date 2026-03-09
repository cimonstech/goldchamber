"use client";

import { useState } from "react";

const subjects = [
  "Membership Enquiry",
  "Regulatory Support",
  "General Enquiry",
  "Media",
  "Partnership",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Enquiry Form</h2>
      {submitted ? (
        <div className="border p-8" style={{ borderColor: "var(--border-gold-strong)", backgroundColor: "var(--bg-card)" }}>
          <p className="font-sans font-medium" style={{ color: "var(--text-primary)" }}>
            Thank you. Your enquiry has been received. We will respond within 2 working days.
          </p>
        </div>
      ) : (
        <form
          className="theme-form space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            const form = e.currentTarget;
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            try {
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error ?? "Failed to send");
              setSubmitted(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to send enquiry. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <label htmlFor="name" className="block font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
              style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="company" className="block font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Company / Organisation
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
              style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
              style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
              style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
              style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none resize-y"
              style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            />
          </div>
          {error && (
            <p className="font-sans text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="font-sans text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Sending…" : "Send Enquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
