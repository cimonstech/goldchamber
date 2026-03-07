import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs — Chamber of Licensed Gold Buyers",
  description:
    "Answers to the most frequently asked questions about CLGB membership, gold trading in Ghana, regulatory compliance, and the GoldBod framework.",
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
