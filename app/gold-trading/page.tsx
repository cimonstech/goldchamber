import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gold Trading & Services",
  description:
    "Ghana's gold sector elevated. Regulatory compliance, GoldBod Aggregator access, pricing intelligence, certification, training, and blockchain traceability.",
  openGraph: {
    title: "Gold Trading & Services — Chamber of Licensed Gold Buyers",
    description: "Regulatory compliance, GoldBod Aggregator access, pricing intelligence, certification.",
  },
};

const services = [
  {
    title: "Regulatory Compliance",
    copy: "We help our members navigate the requirements of the Ghana Gold Board (GoldBod), the Minerals Commission, and all relevant legislation governing the buying and selling of gold in Ghana. Our compliance team monitors regulatory changes in real time and communicates updates directly to members.",
  },
  {
    title: "GoldBod Aggregator Access",
    copy: "CLGB connects members to the top-tier Gold Aggregators that the Government has financially empowered to purchase gold at competitive market prices. This access is one of the most significant advantages of CLGB membership.",
  },
  {
    title: "Pricing & Market Intelligence",
    copy: "Members have access to real-time gold spot prices, exchange rates, and market intelligence tools that enable informed, competitive trading decisions.",
  },
  {
    title: "Certification & Credibility",
    copy: "The CLGB certification seal is a recognised mark of trust in the Ghanaian gold market. It assures international buyers, financial institutions, and regulators that your business operates to the highest standards of ethical sourcing and compliance.",
  },
  {
    title: "Training & Capacity Building",
    copy: "We provide cutting-edge training on responsible mining practices, mercury-free processing, book-keeping, and regulatory compliance — empowering members to operate sustainably and profitably.",
  },
  {
    title: "Blockchain Traceability",
    copy: "Our digital platform enables full supply chain transparency — tracking gold from mine to market and providing verifiable proof of ethical origin to buyers and regulators worldwide.",
  },
];

export default function GoldTradingPage() {
  return (
    <>
      <PageHero
        title="Ghana's Gold Sector. Elevated."
        subtitle="Gold is Ghana's most valuable natural resource. The Chamber of Licensed Gold Buyers exists to ensure that every ounce is traded with integrity, transparency, and full regulatory compliance."
        label="Gold Trading"
      />
      <div className="py-section md:py-section-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-sans text-cream/80 text-base leading-relaxed mb-16 max-w-2xl font-light">
          The trade of this resource happens transparently, fairly, and in full compliance with national law.
        </p>
        <div className="grid md:grid-cols-2 gap-12">
          {services.map((s, i) => (
            <div key={s.title} className="border-l-2 border-gold/40 pl-8">
              <h2 className="font-display text-xl text-cream font-semibold mb-3">{s.title}</h2>
              <p className="font-sans text-cream/80 text-sm leading-relaxed font-light">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
