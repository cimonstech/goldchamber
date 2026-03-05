import Link from "next/link";

export function ContactBanner() {
  return (
    <section className="relative z-10 py-20 md:py-24 bg-dark-2 border-y border-gold/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-h2 text-white font-light mb-6">
          Ready to Trade with Confidence?
        </h2>
        <p className="font-sans text-white/85 text-base leading-relaxed mb-10 font-light">
          Whether you are applying for membership, seeking regulatory guidance, or looking to
          connect with verified buyers — the Chamber of Licensed Gold Buyers is your starting
          point.
        </p>
        <Link
          href="/contact"
          className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 hover:scale-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-sm"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}
