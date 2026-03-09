import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chamberofgoldbuyers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Where Trust Shines as Bright as Gold — Chamber of Licensed Gold Buyers",
    template: "%s | Chamber of Licensed Gold Buyers",
  },
  description:
    "The Chamber of Licensed Gold Buyers — Ghana's premier association for certified gold trading professionals. GoldBod certified. Ethical sourcing guaranteed.",
  keywords: ["gold buyers", "Ghana gold", "GoldBod", "gold trading", "ethical gold", "CLGB"],
  authors: [{ name: "Chamber of Licensed Gold Buyers" }],
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Chamber of Licensed Gold Buyers",
    title: "Where Trust Shines as Bright as Gold — Chamber of Licensed Gold Buyers",
    description: "Ghana's premier association for certified gold trading professionals. GoldBod certified. Ethical sourcing guaranteed.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Chamber of Licensed Gold Buyers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chamber of Licensed Gold Buyers",
    description: "Ghana's premier association for certified gold trading professionals.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var theme=localStorage.getItem('clgb-theme')||'dark';document.documentElement.setAttribute('data-theme',theme);}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
