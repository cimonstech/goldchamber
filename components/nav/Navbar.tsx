"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  {
    label: "About",
    href: "/about",
    children: [
      { href: "/about", label: "Our Story" },
      { href: "/about/leadership", label: "Leadership" },
      { href: "/about/core-values", label: "Core Values" },
      { href: "/about/why-choose-us", label: "Why Choose Us" },
    ],
  },
  { href: "/membership", label: "Membership" },
  { href: "/gold-trading", label: "Services" },
  { href: "/newsroom", label: "News Room" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isScrolled = scrolled;

  return (
    <header
      className={cn(
        "transition-all duration-500",
        isHome && !isScrolled
          ? "bg-transparent"
          : "bg-dark border-b border-gold/30"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/primarylogo-white.png"
              alt="Chamber of Licensed Gold Buyers"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              "children" in item ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "font-sans text-[0.7875rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                      pathname.startsWith(item.href)
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    )}
                  >
                    {item.label}
                  </Link>
                  {aboutOpen && (
                    <div className="absolute top-full left-0 pt-2 w-48">
                      <div className="bg-dark-2 border border-gold/30 rounded py-2 shadow-xl">
                        {(item.children ?? []).map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-[0.7875rem] font-medium uppercase tracking-wider transition-colors",
                              pathname === child.href
                                ? "text-gold bg-gold/10"
                                : "text-white hover:text-gold hover:bg-gold/5"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-sans text-[0.7875rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                    pathname === item.href
                      ? "text-gold"
                      : "text-white hover:text-gold"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                  pathname === "/" ? "text-gold" : "text-white"
                )}
              >
                Home
              </Link>
              <div className="px-4 py-2">
                <span className="font-sans text-[0.7875rem] font-semibold uppercase tracking-wider text-white">
                  About
                </span>
                <div className="mt-2 pl-4 flex flex-col gap-1">
                  {[
                    { href: "/about", label: "Our Story" },
                    { href: "/about/leadership", label: "Leadership" },
                    { href: "/about/core-values", label: "Core Values" },
                    { href: "/about/why-choose-us", label: "Why Choose Us" },
                  ].map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "py-2 text-[0.7875rem]",
                        pathname === child.href ? "text-gold" : "text-white"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/membership"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                  pathname === "/membership" ? "text-gold" : "text-white"
                )}
              >
                Membership
              </Link>
              <Link
                href="/gold-trading"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                  pathname === "/gold-trading" ? "text-gold" : "text-white"
                )}
              >
                Services
              </Link>
              <Link
                href="/newsroom"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                  pathname === "/newsroom" ? "text-gold" : "text-white"
                )}
              >
                News Room
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                  pathname === "/contact" ? "text-gold" : "text-white"
                )}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
