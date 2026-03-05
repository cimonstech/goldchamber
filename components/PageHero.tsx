import Image from "next/image";
import Link from "next/link";

const DEFAULT_HERO_IMAGE = "/colgb-hreo-1.jpg";

type PageHeroProps = {
  /** Page title shown in the hero overlay */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Small label above the title (e.g. "About", "News Room") */
  label?: string;
  /** Sub-navigation links (e.g. Our Story, Leadership) */
  links?: { href: string; label: string; active?: boolean }[];
  /** Custom background image path (default: colgb-hreo-1.jpg) */
  backgroundImage?: string;
};

export function PageHero({
  title,
  subtitle,
  label,
  links,
  backgroundImage = DEFAULT_HERO_IMAGE,
}: PageHeroProps) {
  const hasContent = title || label || (links && links.length > 0);

  return (
    <header
      className={`relative w-full overflow-hidden ${
        hasContent ? "min-h-[42vh] max-h-[520px]" : "h-[38vh] min-h-[220px] max-h-[380px]"
      }`}
    >
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      {/* Dark gradient for readability and depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-dark/75 via-dark/50 to-dark/85"
        aria-hidden
      />
      {/* Subtle grid overlay — futuristic feel */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      {/* Accent: thin gold line at top */}
      <div
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-80"
        aria-hidden
      />

      {hasContent && (
        <div className="absolute inset-0 flex flex-col justify-end">
          {/* Top padding clears sticky nav (GoldPriceBar + Navbar): ~136px desktop, ~144px mobile when price bar wraps */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 pt-36 sm:pt-[8.5rem]">
            {links && links.length > 0 && (
              <nav
                className="flex flex-wrap gap-x-6 gap-y-2 mb-6"
                aria-label="Section"
              >
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-sans text-[11px] font-medium uppercase tracking-[0.22em] border-b pb-1 transition-colors duration-200 ${
                      link.active
                        ? "text-gold border-gold"
                        : "text-white/60 hover:text-gold border-transparent hover:border-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
            {label && (
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-gold mb-3">
                {label}
              </p>
            )}
            {title && (
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-h1 text-white font-light max-w-4xl leading-tight tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="font-sans text-white/80 text-base sm:text-lg mt-4 max-w-2xl font-light leading-relaxed">
                {subtitle}
              </p>
            )}
            {/* Bottom accent line under content */}
            {title && (
              <div
                className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent opacity-70"
                aria-hidden
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
