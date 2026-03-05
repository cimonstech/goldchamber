import Link from "next/link";

const footerLinks = {
  about: [
    { href: "/about", label: "Our Story" },
    { href: "/about/leadership", label: "Leadership" },
    { href: "/about/core-values", label: "Core Values" },
    { href: "/about/why-choose-us", label: "Why Choose Us" },
  ],
  main: [
    { href: "/membership", label: "Membership" },
    { href: "/gold-trading", label: "Gold Trading" },
    { href: "/newsroom", label: "News Room" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/faqs", label: "FAQs" },
    { href: "/gallery", label: "Gallery" },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 bg-dark-2 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <p className="font-display text-xl font-semibold text-white mb-4">
              Chamber of Licensed Gold Buyers
            </p>
            <p className="text-white/70 text-sm font-sans leading-relaxed">
              Where Trust Shines as Bright as Gold. Ghana&apos;s premier association for certified gold trading professionals.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-gold text-sm font-sans transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-gold text-sm font-sans transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-white/75 text-sm font-sans">
              <li>Digital Address: AK-009-2554</li>
              <li>
                <a href="tel:+233266109898" className="hover:text-gold transition-colors">
                  +233 266 10 9898
                </a>
              </li>
              <li>
                <a href="mailto:info@chamberofgoldbuyers.com" className="hover:text-gold transition-colors">
                  info@chamberofgoldbuyers.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm font-sans">
            © {new Date().getFullYear()} Chamber of Licensed Gold Buyers. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-gold text-sm font-sans transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
