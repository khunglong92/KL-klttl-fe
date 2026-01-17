import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";

export default function AppButton({
  label = "",
  size = "lg",
  variant = "default",
  onClick,
  to = undefined,
  loading = false,
  rightSection,
  leftSection,
  disabled = false,
  showArrow = true,
  htmlType = "button",
  className = "",
  noBorder = false,
  "aria-label": ariaLabelProp,
}: {
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "outline-primary" | "outline-danger";
  onClick?: () => void;
  to?: string;
  loading?: boolean;
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
  disabled?: boolean;
  showArrow?: boolean;
  htmlType?: "button" | "submit" | "reset";
  className?: string;
  noBorder?: boolean;
  "aria-label"?: string;
}) {
  const { theme } = useTheme();
  const ariaLabel = ariaLabelProp || label || undefined;
  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "!text-xs !font-bold";
      case "lg":
        return "!text-lg !font-bold";
      case "icon":
        return "!text-xs !font-bold";
      default:
        return "!text-base !font-bold";
    }
  };

  const isExternalLink = (url?: string): boolean => {
    if (!url) return false;
    return (
      url.startsWith("tel:") ||
      url.startsWith("mailto:") ||
      url.startsWith("http:") ||
      url.startsWith("https:")
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to && isExternalLink(to)) {
      window.location.href = to;
    }
  };

  const buttonContent = (
    <>
      {leftSection && <div className="px-2">{leftSection}</div>}
      {loading && <Loader2 className="ml-2 h-5 w-5" />}
      {label}
      {rightSection}
      {showArrow && <ArrowRight className="ml-2 h-5 w-5" />}
    </>
  );
  if (variant === "outline")
    return (
      <Button
        type={htmlType}
        onClick={handleClick}
        size={size}
        variant="outline"
        disabled={disabled}
        aria-label={ariaLabel}
        className={`group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-300 ${className}`}
      >
        {/* Glow for outline button - contained */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg bg-white/15 blur-lg z-0"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Subtle sweeping shine */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-50 mix-blend-screen"
          initial={{ x: "-120%" }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {to && !isExternalLink(to) ? (
          <Link
            to={to}
            className={`relative z-10 inline-flex items-center font-bold text-white! ${getTextSize()}`}
          >
            {buttonContent}
          </Link>
        ) : (
          <span
            className={`relative z-10 inline-flex items-center font-bold text-white! ${getTextSize()}`}
          >
            {buttonContent}
          </span>
        )}
      </Button>
    );

  if (variant === "outline-primary")
    return (
      <Button
        type={htmlType}
        onClick={handleClick}
        size={size}
        variant="outline"
        disabled={disabled}
        aria-label={ariaLabel}
        className={`group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-md ${noBorder ? "border-transparent" : "border-black/30"} text-white hover:bg-white/20 hover:text-white transition-all duration-300 ${className}`}
      >
        {/* Glow for outline button - contained */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg bg-white/15 blur-lg z-0"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Subtle sweeping shine */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-50 mix-blend-screen"
          initial={{ x: "-120%" }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {to && !isExternalLink(to) ? (
          <Link
            to={to}
            className={`relative z-10 inline-flex items-center font-bold ${theme === "dark" ? "text-white!" : "text-black/50"} ${getTextSize()}`}
          >
            {buttonContent}
          </Link>
        ) : (
          <span
            className={`relative z-10 inline-flex items-center font-bold ${theme === "dark" ? "text-white!" : "text-black/50"} ${getTextSize()}`}
          >
            {buttonContent}
          </span>
        )}
      </Button>
    );

  if (variant === "outline-danger")
    return (
      <Button
        type={htmlType}
        onClick={handleClick}
        size={size}
        variant="outline"
        disabled={disabled}
        aria-label={ariaLabel}
        className={`group relative overflow-hidden rounded-lg bg-red-500/5 backdrop-blur-md border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-all duration-300 ${className}`}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-red-500/10 to-transparent opacity-50 mix-blend-screen"
          initial={{ x: "-120%" }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {to && !isExternalLink(to) ? (
          <Link
            to={to}
            className={`relative z-10 inline-flex items-center font-bold text-red-600! ${getTextSize()}`}
          >
            {buttonContent}
          </Link>
        ) : (
          <span
            className={`relative z-10 inline-flex items-center font-bold text-red-600! ${getTextSize()}`}
          >
            {buttonContent}
          </span>
        )}
      </Button>
    );

  return (
    <Button
      className={`group relative overflow-hidden rounded-lg bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-amber-500/50 transition-all duration-300 ${className}`}
      onClick={handleClick}
      type={htmlType}
      size={size}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {/* Enhanced outer glow - contained */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-amber-400/25 blur-xl z-0"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-orange-400/20 blur-lg z-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 2.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Enhanced sweeping shine */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-80 mix-blend-screen"
        initial={{ x: "-120%" }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Inner pulse glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-white/10 z-0"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {to && !isExternalLink(to) ? (
        <Link
          to={to}
          className={`relative z-10 inline-flex items-center font-bold text-white! ${getTextSize()}`}
        >
          {buttonContent}
        </Link>
      ) : (
        <span
          className={`relative z-10 inline-flex items-center font-bold text-white! ${getTextSize()}`}
        >
          {buttonContent}
        </span>
      )}
    </Button>
  );
}
