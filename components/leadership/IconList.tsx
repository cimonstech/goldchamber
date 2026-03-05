import { ReactNode } from "react";

type IconListProps = {
  items: { icon: ReactNode; text: string }[];
  className?: string;
};

export function IconList({ items, className = "" }: IconListProps) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-start">
          <span className="flex-shrink-0 w-10 h-10 rounded border border-gold/30 flex items-center justify-center text-gold">
            {item.icon}
          </span>
          <span className="font-sans text-sm text-cream/85 leading-relaxed font-light pt-1.5">
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
