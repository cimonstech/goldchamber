"use client";

import { useState } from "react";

const tierOptions = [
  "Associate Member",
  "Full Member",
  "Corporate / Institutional Member",
];

export function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section id="membership-form">
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-4">
        Application
      </span>
      <h2 className="font-display text-2xl md:text-3xl text-dark font-light mb-4">Apply for Membership</h2>
      <p className="font-sans text-dark/70 text-base leading-relaxed mb-10 font-light max-w-2xl">
        Membership is open to licensed gold buyers operating in Ghana. Complete the form below and a
        member of the CLGB team will review your submission and contact you within 3 working days.
      </p>
      {submitted ? (
        <div className="border border-gold/40 bg-gold/10 rounded-sm p-8 max-w-xl">
          <p className="font-sans text-dark font-medium leading-relaxed">
            Thank you. Your application has been received. We will be in touch within 3 working
            days.
          </p>
        </div>
      ) : (
        <form
          className="max-w-xl space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            const form = e.currentTarget;
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            try {
              const res = await fetch("/api/membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error ?? "Failed to submit");
              setSubmitted(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {[
            { id: "name", name: "name", label: "Full Name", type: "text", required: true },
            { id: "company", name: "company", label: "Company Name", type: "text", required: false },
            { id: "email", name: "email", label: "Email Address", type: "email", required: true },
            { id: "phone", name: "phone", label: "Phone Number", type: "tel", required: false },
            { id: "license", name: "license", label: "GoldBod License Number", type: "text", required: false },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block font-sans text-xs uppercase tracking-wider text-dark/70 mb-2">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                required={field.required}
                className="w-full bg-white border border-gold/30 px-4 py-3 text-dark font-sans text-sm focus:border-gold focus:outline-none"
              />
            </div>
          ))}
          <div>
            <label htmlFor="tier" className="block font-sans text-xs uppercase tracking-wider text-dark/70 mb-2">
              Membership Tier
            </label>
            <select
              id="tier"
              name="tier"
              required
              className="w-full bg-white border border-gold/30 px-4 py-3 text-dark font-sans text-sm focus:border-gold focus:outline-none"
            >
              <option value="">Select tier</option>
              {tierOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block font-sans text-xs uppercase tracking-wider text-dark/70 mb-2">
              Message / Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full bg-white border border-gold/30 px-4 py-3 text-dark font-sans text-sm focus:border-gold focus:outline-none resize-y"
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
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      )}
      <p className="mt-8 font-sans text-sm text-dark/50">
        Download our{" "}
        <a href="#" className="text-gold hover:underline">
          Membership Tracking Dashboard (PDF)
        </a>{" "}
        for your records.
      </p>
    </section>
  );
}
