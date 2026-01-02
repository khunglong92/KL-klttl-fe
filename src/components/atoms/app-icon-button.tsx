import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import React from "react";

interface AppIconButtonProps {
  icon: React.ReactElement;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline";
  shape?: "default" | "circle";
  onClick?: () => void;
  to?: string;
  className?: string;
}

export default function AppIconButton({
  icon,
  size = "lg",
  variant = "default",
  shape = "default",
  onClick,
  to,
  className,
}: AppIconButtonProps) {
  const buttonClasses = cn(
    "group relative overflow-hidden transition-all duration-300",
    shape === "circle" && "rounded-full",
    className
  );

  const content = (
    <>
      {/* Motion effects */}
      {variant === "default" ? (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg bg-amber-400/25 blur-xl z-0"
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-80 mix-blend-screen"
            initial={{ x: "-120%" }}
            animate={{ x: ["-120%", "120%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-50 mix-blend-screen"
          initial={{ x: "-120%" }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="relative z-10">{icon}</span>
    </>
  );

  const buttonProps = {
    size,
    variant,
    className: cn(
      buttonClasses,
      variant === "outline"
        ? "rounded-lg bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white"
        : "rounded-lg bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-amber-500/50"
    ),
  };

  if (to) {
    return (
      <Button {...buttonProps} asChild>
        <Link to={to}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button {...buttonProps} onClick={onClick}>
      {content}
    </Button>
  );
}
