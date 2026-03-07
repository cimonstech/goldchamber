import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CLGB — Chamber of Licensed Gold Buyers",
  description:
    "Learn about the Chamber of Licensed Gold Buyers — Ghana's foremost association for certified gold trading professionals.",
  openGraph: {
    title: "About CLGB — Chamber of Licensed Gold Buyers",
    description:
      "Learn about the Chamber of Licensed Gold Buyers — Ghana's foremost association for certified gold trading professionals.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
