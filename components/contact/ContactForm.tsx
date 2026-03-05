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

  return (
    <div>
      <h2 className="font-display text-xl text-cream font-semibold mb-6">Enquiry Form</h2>
      {submitted ? (
        <div className="border border-gold/40 bg-gold/5 p-8">
          <p className="font-sans text-cream font-medium">
            Thank you. Your enquiry has been received. We will respond within 2 working days.
          </p>
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label htmlFor="name" className="block font-sans text-xs uppercase tracking-wider text-cream/80 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-cream font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="company" className="block font-sans text-xs uppercase tracking-wider text-cream/80 mb-2">
              Company / Organisation
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-cream font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-sans text-xs uppercase tracking-wider text-cream/80 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-cream font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-sans text-xs uppercase tracking-wider text-cream/80 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-cream font-sans text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block font-sans text-xs uppercase tracking-wider text-cream/80 mb-2">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-cream font-sans text-sm focus:border-gold focus:outline-none"
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
            <label htmlFor="message" className="block font-sans text-xs uppercase tracking-wider text-cream/80 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full bg-dark-2 border border-gold/30 px-4 py-3 text-cream font-sans text-sm focus:border-gold focus:outline-none resize-y"
            />
          </div>
          <button
            type="submit"
            className="font-sans text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm cursor-pointer"
          >
            Send Enquiry
          </button>
        </form>
      )}
    </div>
  );
}
