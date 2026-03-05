import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "FAQs — Chamber of Licensed Gold Buyers",
  description:
    "Frequently asked questions about CLGB membership, gold trading, ethical sourcing, and regulatory compliance.",
};

const faqs = [
  {
    q: "What is the Chamber of Licensed Gold Buyers?",
    a: "The Chamber of Licensed Gold Buyers (CLGB) is Ghana's foremost association representing certified gold trading professionals. We serve as the bridge between miners, buyers, and regulatory institutions, ensuring transparent, ethical, and fully compliant gold trading.",
  },
  {
    q: "Who can become a member?",
    a: "Membership is open to licensed gold buyers operating in Ghana. We offer Associate, Full, and Corporate/Institutional membership tiers to suit individuals, companies, and financial institutions.",
  },
  {
    q: "What is GoldBod?",
    a: "The Ghana Gold Board (GoldBod) is the national body governing gold trading. CLGB works closely with GoldBod to ensure our members meet all regulatory requirements and have access to GoldBod Aggregators.",
  },
  {
    q: "How do I apply for membership?",
    a: "Complete the application form on our Membership page. A member of the CLGB team will review your submission and contact you within 3 working days.",
  },
  {
    q: "How can I start trading gold?",
    a: "You must be a Ghanaian 18 years of age and of a sound mind before you apply to PMMC turned into GOLDBOD for license to trade as an Aggregator or through an Aggregator to GoldBod.",
  },
  {
    q: "What factors influence gold prices?",
    a: "Geopolitical tensions, inflation, currency fluctuations (e.g., USD strength), central bank policies, and supply-demand dynamics.",
  },
  {
    q: "Is gold trading risky?",
    a: "Yes—prices can be volatile. Diversify investments, avoid over-leveraging, and stay informed about market trends.",
  },
  {
    q: "How can I test gold at home?",
    a: "Magnet Test: Real gold isn't magnetic. Weight/Density: Gold is dense (19.3 g/cm³). Fake gold feels lighter. Hallmark Check: Look for purity stamps (e.g., 24K, 18K).",
  },
  {
    q: "What are common signs of fake Dore gold or jewelry?",
    a: "Discoloration (e.g., greenish tinge), scratches revealing base metal, or inconsistent weight. EPNS Gold and EPBM Gold are examples of fake Dore Gold.",
  },
  {
    q: "Should I get gold professionally verified?",
    a: "Absolutely yes—for high-value items, use an XRF spectrometer or acid test by a certified assayer.",
  },
  {
    q: "What is responsible gold mining?",
    a: "Mining that minimizes environmental harm, avoids child labor, ensures fair wages, and rehabilitates ecosystems post-mining (reclamation).",
  },
  {
    q: "How can I ensure my gold is ethically sourced?",
    a: "Buy from brands certified by GOLDBOD, Fairtrade Gold, Fairmined, or LBMA Responsible Gold Guidance.",
  },
  {
    q: "What certifications indicate ethical gold?",
    a: "Fairmined: Ensures eco-friendly practices and community benefits. RJC (Responsible Jewellery Council): Covers human rights and environmental standards.",
  },
  {
    q: "How does galamsey (illegal mining) harm the environment?",
    a: "It causes deforestation, mercury pollution (used in extraction), and river contamination, endangering ecosystems and human health.",
  },
];

export default function FAQsPage() {
  return (
    <>
      <PageHero
        label="Support"
        title="Frequently Asked Questions"
        subtitle="Gold trading, certification, and ethical sourcing."
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:py-20">
        <dl className="space-y-10">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-gold/20 pb-8">
              <dt className="font-display text-lg text-cream font-semibold mb-3">{faq.q}</dt>
              <dd className="font-sans text-cream/80 text-sm leading-relaxed font-light">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
