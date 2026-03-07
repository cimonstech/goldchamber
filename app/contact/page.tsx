import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Chamber of Licensed Gold Buyers. Membership, regulatory support, and business enquiries.",
  openGraph: {
    title: "Contact — Chamber of Licensed Gold Buyers",
    description: "Membership, regulatory support, and business enquiries.",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact" title="Get in Touch" subtitle="Whether you are enquiring about membership, seeking regulatory guidance, or have a business proposition — our team is ready to assist." />
      <div className="py-section md:py-section-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-sans text-cream/80 text-base leading-relaxed mb-12 max-w-2xl font-light">
          Complete the form below and a member of our team will respond within 2 working days.
        </p>
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-display text-xl text-white font-semibold mb-6">Contact Details</h2>
              <ul className="space-y-4 font-sans text-cream/80 text-sm">
                <li>
                  <span className="text-gold uppercase tracking-wider text-xs block mb-1">
                    Digital Address
                  </span>
                  AK-009-2554
                </li>
                <li>
                  <span className="text-gold uppercase tracking-wider text-xs block mb-1">Phone</span>
                  <a href="tel:+233266109898" className="hover:text-gold transition-colors">
                    +233 266 10 9898
                  </a>
                </li>
                <li>
                  <span className="text-gold uppercase tracking-wider text-xs block mb-1">
                    Business Line
                  </span>
                  <a href="tel:+233244824444" className="hover:text-gold transition-colors">
                    +233 244 82 4444
                  </a>
                </li>
                <li>
                  <span className="text-gold uppercase tracking-wider text-xs block mb-1">Email</span>
                  <a
                    href="mailto:info@chamberofgoldbuyers.com"
                    className="hover:text-gold transition-colors"
                  >
                    info@chamberofgoldbuyers.com
                  </a>
                </li>
                <li>
                  <span className="text-gold uppercase tracking-wider text-xs block mb-1">
                    Business Email
                  </span>
                  <a
                    href="mailto:business@chamberofgoldbuyers.com"
                    className="hover:text-gold transition-colors"
                  >
                    business@chamberofgoldbuyers.com
                  </a>
                </li>
                <li>
                  <span className="text-gold uppercase tracking-wider text-xs block mb-1">Hours</span>
                  Monday – Friday, 9:00am – 6:00pm. Closed weekends.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl text-white font-semibold mb-4">Find us</h2>
              <div className="rounded-lg overflow-hidden border border-gold/20 aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3962.489288952144!2d-1.6068388!3d6.709982699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNDInMzUuOSJOIDHCsDM2JzI0LjYiVw!5e0!3m2!1sen!2sgh!4v1772722363230!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 280 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chamber of Licensed Gold Buyers location"
                  className="w-full h-full min-h-[280px]"
                />
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
      </div>
    </>
  );
}
