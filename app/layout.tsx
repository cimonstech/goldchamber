import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { ParticleBackgroundWrapper } from "@/components/ParticleBackgroundWrapper";
import { GoldPriceBar } from "@/components/GoldPriceBar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Where Trust Shines as Bright as Gold — Chamber of Licensed Gold Buyers",
  description:
    "The Chamber of Licensed Gold Buyers — Ghana's premier association for certified gold trading professionals. GoldBod certified. Ethical sourcing guaranteed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-dark text-cream">
        <ParticleBackgroundWrapper />
        <div className="sticky top-0 z-50">
          <GoldPriceBar />
          <Navbar />
        </div>
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
