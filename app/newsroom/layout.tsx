import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsroom — Chamber of Licensed Gold Buyers",
  description:
    "The latest news, press releases, and regulatory updates from the Chamber of Licensed Gold Buyers.",
};

export default function NewsroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
