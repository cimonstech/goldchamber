"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Newspaper,
  FileText,
  Send,
  Settings,
  LogOut,
  Bell,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Members", href: "/admin/members" },
  { icon: ClipboardList, label: "Applications", href: "/admin/applications" },
  { icon: Newspaper, label: "News", href: "/admin/news" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: Send, label: "Communications", href: "/admin/communications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
] as const;

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/members": "Members",
  "/admin/applications": "Applications",
  "/admin/news": "News",
  "/admin/documents": "Documents",
  "/admin/communications": "Communications",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === path || pathname.startsWith(path + "/")) return title;
  }
  return "Admin";
}

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<{ full_name: string | null; email: string } | null>(null);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications?counts=1")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && setPendingApplicationsCount(data.pending ?? 0))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      Promise.resolve(
        supabase.from("profiles").select("full_name, email").eq("id", user.id).single()
      ).then(({ data }) => {
        if (data) setAdmin(data);
        else setAdmin({ full_name: user.user_metadata?.full_name ?? null, email: user.email ?? "" });
      }).catch(() => setAdmin({ full_name: user.user_metadata?.full_name ?? null, email: user.email ?? "" }));
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const pageTitle = getPageTitle(pathname ?? "");

  const SidebarContent = () => (
    <>
      <div className="p-6 pb-2">
        <Image
          src={theme === "dark" ? "/primarylogo-white.png" : "/primarylogo-gold.png"}
          alt="CLGB"
          width={120}
          height={32}
          className="block"
        />
      </div>
      <p
        className="px-6 pb-6"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 8,
          letterSpacing: "4px",
          color: "var(--text-label)",
          textTransform: "uppercase",
        }}
      >
        ADMIN PORTAL
      </p>
      <div
        className="w-full h-px mb-4"
          style={{ backgroundColor: "var(--border-subtle)" }}
      />
      <nav className="flex-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          const showPendingBadge = href === "/admin/applications" && pendingApplicationsCount != null && pendingApplicationsCount > 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-colors duration-200 border-l-2",
                isActive
                  ? "text-[var(--gold-primary)] bg-[var(--gold-glow)] border-[var(--gold-primary)]"
                  : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[rgba(201,168,76,0.06)]"
              )}
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 11,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              <Icon size={16} />
              {label}
              {showPendingBadge && (
                <span
                  className="min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[9px] font-bold ml-auto"
                  style={{ background: "rgba(234,179,8,0.3)", color: "#eab308" }}
                >
                  {pendingApplicationsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-6 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        {admin && (
          <div
            className="mb-4 font-sans text-[11px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
              {admin.full_name || "Admin"}
            </p>
            <p className="text-[10px] truncate">{admin.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-6 py-3 rounded transition-colors duration-200 hover:text-[#ef4444]"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Sidebar — desktop */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 w-[260px] h-screen z-50"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside
            className="fixed left-0 top-0 w-[260px] h-screen z-[70] flex flex-col lg:hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderRight: "1px solid var(--border-subtle)",
          }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="lg:ml-[260px] min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between h-16 px-8"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2"
              style={{ color: "var(--text-primary)" }}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <h1
              className="font-display font-light"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: 24,
                color: "var(--text-primary)",
              }}
            >
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
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
            <Link
              href="/admin/applications"
              className="relative p-2"
              style={{ color: "var(--text-primary)" }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {pendingApplicationsCount != null && pendingApplicationsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: "#eab308", color: "#050505" }}
                >
                  {pendingApplicationsCount}
                </span>
              )}
            </Link>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--gold-glow)",
                color: "var(--gold-primary)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {admin ? getInitials(admin.full_name, admin.email) : "—"}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
