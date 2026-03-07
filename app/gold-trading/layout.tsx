import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Trading — Chamber of Licensed Gold Buyers",
  description:
    "Discover the full range of gold trading services offered by CLGB — from regulatory support and market intelligence to blockchain traceability and elite buyer networks.",
};

export default function GoldTradingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
