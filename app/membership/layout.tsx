import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership — Chamber of Licensed Gold Buyers",
  description:
    "Join Ghana's most trusted gold trading network. Apply for CLGB membership and gain access to GoldBod Aggregators, elite networking, and full regulatory support.",
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
