import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description:
    "Why the Chamber of Licensed Gold Buyers is the gold standard for trusted gold trade in Ghana.",
  openGraph: {
    title: "Why Choose Us — Chamber of Licensed Gold Buyers",
    description: "The gold standard for trusted gold trade in Ghana.",
  },
};

const aboutLinks = [
  { href: "/about", label: "Our Story", active: false },
  { href: "/about/leadership", label: "Leadership", active: false },
  { href: "/about/core-values", label: "Core Values", active: false },
  { href: "/about/why-choose-us", label: "Why Choose Us", active: true },
];

const benefits = [
  "Access to GoldBod Aggregators — top-tier buyers empowered by the Government to purchase gold at competitive prices.",
  "Fair & Transparent Pricing — real-time pricing tools that guarantee fair compensation for miners and traders.",
  "Rigorous Certification — the CLGB seal is a recognised mark of trust, assuring buyers that your gold is ethically sourced and fully compliant.",
  "Training & Capacity Building — cutting-edge training on responsible mining, mercury-free processing, and regulatory compliance.",
  "Blockchain-Powered Traceability — full transparency from mine to market, provable to buyers and regulators.",
  "Financial & Legal Support — tailored financial services, legal advice, and insurance options designed for the gold trade.",
];

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHero
        title="The Gold Standard of Trusted Trade"
        subtitle="Why licensed gold buyers and partners choose the Chamber."
        label="About"
        links={aboutLinks}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-section md:py-section-md">
        <ul className="space-y-6">
          {benefits.map((item, i) => (
            <li
              key={i}
              className="font-sans text-cream/80 text-base leading-relaxed pl-6 border-l-2 border-gold/30 hover:border-gold/60 transition-colors py-1"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
