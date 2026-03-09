"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Home" },
  {
    label: "About",
    href: "/about",
    children: [
      { href: "/about", label: "Our Story" },
      { href: "/about/leadership", label: "Leadership" },
    ],
  },
  { href: "/membership", label: "Membership" },
  { href: "/gold-trading", label: "Services" },
  { href: "/newsroom", label: "News Room" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const setUserFromAuth = (u: { id: string; email?: string } | null) => {
    setUser(u ? { id: u.id, email: u.email ?? "" } : null);
  };
  const [profile, setProfile] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUserFromAuth(u ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromAuth(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const supabase = createClient();
    supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => setProfile(data));
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.refresh();
  };

  const isHome = pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "transition-all duration-500",
        isTransparent
          ? "bg-transparent"
          : "border-b"
      )}
      style={!isTransparent ? { backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" } : undefined}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={isTransparent ? "/primarylogo-white.png" : "/primarylogo-gold.png"}
              alt="Chamber of Licensed Gold Buyers"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-4 lg:gap-8">
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
                      "nav-link font-sans text-[0.7875rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                      pathname.startsWith(item.href)
                        ? "text-gold"
                        : isTransparent
                          ? "text-white hover:text-gold"
                          : ""
                    )}
                    style={!isTransparent && !pathname.startsWith(item.href) ? { color: "var(--text-primary)" } : undefined}
                  >
                    {item.label}
                  </Link>
                  {aboutOpen && (
                    <div className="absolute top-full left-0 pt-2 w-48">
                      <div className="rounded py-2 shadow-xl" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-gold)" }}>
                        {(item.children ?? []).map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-[0.7875rem] font-medium uppercase tracking-wider transition-colors",
                              pathname === child.href
                                ? "text-gold"
                                : "hover:text-gold"
                            )}
                            style={{
                              ...(pathname === child.href
                                ? { color: "var(--gold-primary)", backgroundColor: "var(--bg-card)" }
                                : { color: "var(--text-primary)" }
                              ),
                            }}
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
                    "nav-link font-sans text-[0.7875rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                    pathname === item.href
                      ? "text-gold"
                      : isTransparent
                        ? "text-white hover:text-gold"
                        : ""
                  )}
                  style={!isTransparent && pathname !== item.href ? { color: "var(--text-primary)" } : undefined}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* User menu (logged in) or Login link */}
          {user ? (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-full transition-colors hover:bg-[rgba(201,168,76,0.1)]"
                style={{ color: isTransparent ? "#fff" : "var(--gold-primary)" }}
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
              >
                <User size={20} />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden
                  />
                  <div
                    className="absolute right-0 top-full mt-2 z-50 py-2 rounded shadow-xl min-w-[180px]"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-gold)",
                    }}
                  >
                    <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                      <p className="font-sans text-[11px] truncate" style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={profile?.role === "admin" ? "/admin/dashboard" : "/portal/dashboard"}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 font-sans text-[11px] uppercase tracking-wider hover:bg-[rgba(201,168,76,0.08)]"
                      style={{ color: "var(--text-primary)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      <User size={14} />
                      {profile?.role === "admin" ? "Admin Dashboard" : "Member Portal"}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 font-sans text-[11px] uppercase tracking-wider hover:bg-[rgba(239,68,68,0.08)] text-left"
                      style={{ color: "#ef4444", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden lg:flex font-sans text-[0.7875rem] font-semibold uppercase tracking-[0.2em] transition-colors"
              style={isTransparent ? { color: "#fff" } : { color: "var(--text-primary)" }}
            >
              Login
            </Link>
          )}

          {/* Theme toggle — left of mobile menu */}
          <div
            className="relative"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="relative w-11 h-6 rounded-xl border cursor-pointer transition-all duration-300 flex-shrink-0"
              style={{
                backgroundColor: theme === "dark" ? "rgba(201,168,76,0.2)" : "rgba(160,120,20,0.15)",
                borderColor: "var(--border-gold)",
              }}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span
                className="absolute top-[3px] w-[18px] h-[18px] rounded-full flex items-center justify-center transition-[left] duration-300 ease-out"
                style={{
                  left: theme === "dark" ? "3px" : "22px",
                  background: "var(--gold-gradient)",
                }}
              >
                {theme === "dark" ? (
                  <Moon size={10} style={{ color: "#050505" }} />
                ) : (
                  <Sun size={10} style={{ color: "#ffffff" }} />
                )}
              </span>
            </button>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-2 pointer-events-none"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "9px",
                whiteSpace: "nowrap",
                opacity: tooltipVisible ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            >
              <div
                className="px-2 py-1 rounded border"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              </div>
            </div>
          </div>
          </div>

          {/* Mobile menu button — min 44px touch target */}
          <button
            type="button"
            className="lg:hidden p-3 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: isTransparent ? "#fff" : "var(--text-primary)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
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
          <div className="lg:hidden py-4 border-t" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-primary)" }}>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                  pathname === "/" ? "text-gold" : ""
                )}
                style={pathname !== "/" ? { color: "var(--text-primary)" } : undefined}
              >
                Home
              </Link>
              <div className="px-4 py-2">
                <span className="font-sans text-[0.7875rem] font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                  About
                </span>
                <div className="mt-2 pl-4 flex flex-col gap-1">
                  {[
                    { href: "/about", label: "Our Story" },
                    { href: "/about/leadership", label: "Leadership" },
                  ].map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "py-2 text-[0.7875rem]",
                        pathname === child.href ? "text-gold" : ""
                      )}
                      style={pathname !== child.href ? { color: "var(--text-primary)" } : undefined}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
              {[
                { href: "/membership", label: "Membership" },
                { href: "/gold-trading", label: "Services" },
                { href: "/newsroom", label: "News Room" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider",
                    pathname === item.href ? "text-gold" : ""
                  )}
                  style={pathname !== item.href ? { color: "var(--text-primary)" } : undefined}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href={profile?.role === "admin" ? "/admin/dashboard" : "/portal/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: "var(--gold-primary)" }}
                  >
                    <User size={14} />
                    {profile?.role === "admin" ? "Admin Dashboard" : "Member Portal"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider text-left flex items-center gap-2"
                    style={{ color: "#ef4444" }}
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 font-sans text-[0.7875rem] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--gold-primary)" }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
