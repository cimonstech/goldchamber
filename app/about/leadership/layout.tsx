import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership — Chamber of Licensed Gold Buyers",
  description:
    "Meet the visionaries behind CLGB — Job Osei Tutu, Daniel Boateng Sarpong, and Kwaku Amoah.",
};

export default function LeadershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
