import { LucideIcon } from "lucide-react";

interface PremiumContactButtonProps {
  Icon?:
    | LucideIcon
    | React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  imageSrc?: string;
  color: string;
  href: string;
  title: string;
}

export function PremiumContactButton({
  Icon,
  imageSrc,
  color,
  href,
  title,
}: PremiumContactButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      title={title}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:opacity-80 active:scale-95"
    >
      {imageSrc ? (
        <img src={imageSrc} alt={title} className="w-7 h-7 object-contain" />
      ) : Icon ? (
        <Icon className="w-7 h-7" style={{ color }} />
      ) : null}
    </a>
  );
}
