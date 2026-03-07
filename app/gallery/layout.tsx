import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Chamber of Licensed Gold Buyers",
  description:
    "Photos and media from the Chamber of Licensed Gold Buyers — events, members, and Ghana's gold trading sector.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
