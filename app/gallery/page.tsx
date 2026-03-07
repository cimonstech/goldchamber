import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Media gallery and imagery from the Chamber of Licensed Gold Buyers.",
  openGraph: {
    title: "Gallery — Chamber of Licensed Gold Buyers",
    description: "Media gallery and imagery from CLGB events and activities.",
  },
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
      <div className="py-section md:py-section-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.src}
              className="aspect-[4/3] relative overflow-hidden border border-gold/20 group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
