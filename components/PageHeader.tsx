import Link from "next/link";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  label?: string;
  links?: { href: string; label: string; active?: boolean }[];
  withHero?: boolean;
};

export function PageHeader({ title, subtitle, label, links, withHero }: PageHeaderProps) {
  return (
    <header className="relative border-b border-gold/20 bg-dark-2/50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 ${withHero ? "pt-10" : "pt-32"}`}>
        {links && links.length > 0 && (
          <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-6" aria-label="Section">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-xs font-medium uppercase tracking-[0.2em] border-b pb-1 transition-colors ${
                  link.active ? "text-gold border-gold" : "text-white/70 hover:text-gold border-transparent hover:border-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        {label && (
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-2">
            {label}
          </p>
        )}
        <h1 className="font-display text-h1 text-white font-light max-w-4xl">{title}</h1>
        {subtitle && (
          <p className="font-sans text-white/75 text-lg mt-4 max-w-2xl font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
