"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { GoldPriceBar } from "@/components/GoldPriceBar";
import { ParticleBackgroundWrapper } from "@/components/ParticleBackgroundWrapper";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");
  const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/portal");

  if (isAuth) {
    return <>{children}</>;
  }

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <ParticleBackgroundWrapper />
      <div className="sticky top-0 z-50">
        <div className="hidden md:block">
          <GoldPriceBar />
        </div>
        <Navbar />
      </div>
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
