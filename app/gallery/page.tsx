import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery — Chamber of Licensed Gold Buyers",
  description: "Media gallery and imagery from the Chamber of Licensed Gold Buyers.",
};

const images = [
  { src: "/gold-bars.jpg", alt: "Gold bars" },
  { src: "/gold-bars2.jpg", alt: "Gold" },
  { src: "/goldbars3.jpeg", alt: "Gold bars" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        label="Media"
        title="Media Gallery"
        subtitle="Imagery and media from CLGB events, gold sector, and institutional activities."
      />
      <div className="pt-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.src}
              className="aspect-[4/3] relative overflow-hidden border border-gold/20"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
