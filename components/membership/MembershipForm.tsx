"use client";

import { useState } from "react";

const tierOptions = [
  "Associate Member",
  "Full Member",
  "Corporate / Institutional Member",
];

export function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section>
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-4">
        Application
      </span>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-4">Apply for Membership</h2>
      <p className="font-sans text-white/80 text-base leading-relaxed mb-10 font-light max-w-2xl">
        Membership is open to licensed gold buyers operating in Ghana. Complete the form below and a
        member of the CLGB team will review your submission and contact you within 3 working days.
      </p>
      {submitted ? (
        <div className="border border-gold/40 bg-gold/10 rounded-sm p-8 max-w-xl">
          <p className="font-sans text-white font-medium leading-relaxed">
            Thank you. Your application has been received. We will be in touch within 3 working
            days.
          </p>
        </div>
      ) : (
        <form
          className="max-w-xl space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label htmlFor="name" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="company" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              Company Name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="license" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              GoldBod License Number
            </label>
            <input
              id="license"
              name="license"
              type="text"
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="tier" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              Membership Tier
            </label>
            <select
              id="tier"
              name="tier"
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none"
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
            <label htmlFor="message" className="block font-sans text-xs uppercase tracking-wider text-white/80 mb-2">
              Message / Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-white font-sans text-sm focus:border-gold focus:outline-none resize-y"
            />
          </div>
          <button
            type="submit"
            className="font-sans text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm cursor-pointer"
          >
            Submit Application
          </button>
        </form>
      )}
      <p className="mt-8 font-sans text-sm text-white/60">
        Download our{" "}
        <a href="#" className="text-gold hover:underline">
          Membership Tracking Dashboard (PDF)
        </a>{" "}
        for your records.
      </p>
    </section>
  );
}
