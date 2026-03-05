import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Core Values — Chamber of Licensed Gold Buyers",
  description:
    "The core values that guide the Chamber of Licensed Gold Buyers: integrity, transparency, empowerment, sustainability.",
};

const aboutLinks = [
  { href: "/about", label: "Our Story", active: false },
  { href: "/about/leadership", label: "Leadership", active: false },
  { href: "/about/core-values", label: "Core Values", active: true },
  { href: "/about/why-choose-us", label: "Why Choose Us", active: false },
];

const values = [
  {
    title: "Integrity Above All",
    copy: "Every decision, every transaction, every membership we certify is held to the same standard: complete integrity. We do not compromise on the ethical foundations of the gold trade.",
  },
  {
    title: "Transparency in Trade",
    copy: "From pricing to sourcing to regulatory compliance, we believe that transparency is the bedrock of a sustainable gold sector. Our members trade in the open, with nothing to hide.",
  },
  {
    title: "Empowerment Through Knowledge",
    copy: "We invest in our members. Through training, capacity building, and market intelligence, we ensure that every licensed gold buyer has the knowledge to operate profitably and responsibly.",
  },
  {
    title: "Sustainability for Generations",
    copy: "The gold beneath Ghana's soil belongs to all Ghanaians. We are committed to a gold sector that honours the environment, supports mining communities, and creates lasting prosperity.",
  },
];

export default function CoreValuesPage() {
  return (
    <>
      <PageHero
        title="What We Stand For"
        subtitle="The principles that guide every decision we make."
        label="About"
        links={aboutLinks}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          {values.map((v) => (
            <div key={v.title} className="border-l-2 border-gold/50 pl-8">
              <h2 className="font-display text-xl text-cream font-semibold mb-3">{v.title}</h2>
              <p className="font-sans text-cream/80 text-sm leading-relaxed font-light">{v.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
