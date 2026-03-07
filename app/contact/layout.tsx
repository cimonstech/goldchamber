import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Chamber of Licensed Gold Buyers",
  description:
    "Get in touch with the Chamber of Licensed Gold Buyers. We are here to answer your questions about membership, gold trading, and regulatory compliance.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
