import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { MembershipTiers } from "@/components/membership/MembershipTiers";
import { MembershipForm } from "@/components/membership/MembershipForm";
import { MemberAvatars } from "@/components/membership/MemberAvatars";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join the Chamber of Licensed Gold Buyers. Apply for Associate, Full, or Corporate membership. GoldBod certified, regulatory support, elite networking.",
  openGraph: {
    title: "Membership — Chamber of Licensed Gold Buyers",
    description: "Apply for Associate, Full, or Corporate membership. GoldBod certified, regulatory support.",
  },
};

const tiers = [
  {
    name: "Associate Member",
    recommended: false,
    benefits: [
      "Access to CLGB directory listing",
      "Regulatory update newsletters",
      "Attendance at CLGB public events",
      "Basic compliance guidance",
    ],
  },
  {
    name: "Full Member",
    recommended: true,
    benefits: [
      "All Associate benefits",
      "CLGB Certification Seal for business use",
      "Access to GoldBod Aggregator network",
      "Real-time gold pricing dashboard",
      "Priority regulatory support",
      "Invitation to exclusive CLGB networking events",
      "Inclusion in Africa Ethical Gold Summit",
    ],
  },
  {
    name: "Corporate / Institutional Member",
    recommended: false,
    benefits: [
      "All Full Member benefits",
      "Multi-user access for company teams",
      "Dedicated account manager",
      "Blockchain traceability platform access",
      "Tailored legal & financial advisory services",
      "Featured listing in CLGB institutional directory",
      "Speaking opportunities at CLGB events",
    ],
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        title="Join the Chamber. Elevate Your Trade."
        subtitle="CLGB membership is the mark of a serious, credible, and compliant gold buyer in Ghana. Our members gain access to a network, a certification, and a set of tools that no individual or company in the gold sector can afford to be without."
        label="Become a Member"
      />
      <div className="bg-dark pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-20">
            <MemberAvatars />
          </section>
          <section className="mb-20">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-4">
              Membership Tiers
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-4 max-w-2xl">
              Choose the tier that fits your business
            </h2>
            <p className="font-sans text-white/75 text-base leading-relaxed mb-12 max-w-2xl font-light">
              From individual buyers to institutional partners — find the level of access and support you need.
            </p>
            <MembershipTiers tiers={tiers} />
          </section>
          <section className="pt-12 border-t border-gold/20">
            <MembershipForm />
          </section>
        </div>
      </div>
    </>
  );
}
