import { ReactNode } from "react";
import Image from "next/image";

type LeaderProfileProps = {
  name: string;
  role: string;
  image?: string;
  imagePlaceholder?: boolean;
  children: ReactNode;
  quote?: string;
};

export function LeaderProfile({
  name,
  role,
  image,
  imagePlaceholder = true,
  children,
  quote,
}: LeaderProfileProps) {
  return (
    <section className="relative py-16 md:py-24 border-b border-gold/10 last:border-b-0 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <div className="sticky top-36">
              <div className="aspect-[3/4] relative bg-dark-2 border border-gold/20 overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-dark-3 to-dark-2">
                    <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold/50">
                      Photo
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-gold border border-gold/40 px-3 py-1.5 mb-3">
                  {role}
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-cream font-light">{name}</h2>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            {quote && (
              <blockquote className="font-display text-xl md:text-2xl text-cream/90 font-light leading-snug border-l-2 border-gold pl-6 mb-10 italic">
                &ldquo;{quote}&rdquo;
              </blockquote>
            )}
            <div className="font-sans text-cream/85 text-base leading-[1.8] space-y-6 prose prose-invert max-w-none [&>p]:font-light">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
