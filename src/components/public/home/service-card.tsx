import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/public/figma/ImageWithFallback";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

import { CompanyService } from "@/services/api/servicesService";

export interface ServiceCardProps {
  service: Partial<CompanyService>;
  index?: number;
  className?: string;
}

export function ServiceCard({
  service,
  index = 0,
  className,
}: ServiceCardProps) {
  const { title, subtitle, imageUrls, slug, id } = service || {};
  const [isHovered, setIsHovered] = useState(false);
  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    inView: { opacity: 1, y: 0, scale: 1 },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, rotate: 2 },
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="inView"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("group relative w-full max-w-[300px] shrink-0", className)}
    >
      {/* Subtle Glow Effect */}
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
        transition={{ duration: 0.4 }}
        className="absolute -inset-1 rounded-2xl bg-foreground/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30"
        aria-hidden="true"
      />

      {/* Main Card */}
      <div className="relative flex h-[300px] flex-col overflow-hidden rounded-2xl border border-border shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-xl">
        {/* Background Image - Full Card */}
        <div className="absolute inset-0">
          <motion.div
            variants={imageVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full w-full"
          >
            <ImageWithFallback
              src={imageUrls?.[0] || "https://via.placeholder.com/400"}
              alt={title || "Service Image"}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        </div>

        {/* Empty top section to push content down */}
        <div className="relative h-[120px] overflow-hidden rounded-t-2xl">
          <Link
            to="/services/$id"
            params={{ id: slug || id || "" }}
            className="block h-full w-full"
          />
        </div>

        {/* Content Section */}
        <div className="relative flex flex-1 flex-col justify-end p-4">
          {/* Service Name */}
          <div className="space-y-2">
            <Link
              to="/services/$id"
              params={{ id: slug || id || "" }}
              className="group/title block"
            >
              <h3 className="line-clamp-2 text-base font-bold leading-tight text-white transition-colors duration-300 group-hover/title:text-white/80">
                {title}
              </h3>
            </Link>
            {isHovered && subtitle && (
              <p className="line-clamp-2 text-sm text-white/70 transition-all duration-300">
                {subtitle}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            variant="outline"
            className="group/btn relative w-full overflow-hidden rounded-xl bg-background/95 backdrop-blur-md border-2 border-white/20 py-4 text-sm font-semibold shadow-2xl transition-all duration-300 hover:bg-background hover:scale-105 active:scale-100"
            asChild
          >
            <Link to="/services/$id" params={{ id: slug || id || "" }}>
              {/* Subtle Shine Effect */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-50"
                initial={{ x: "-150%" }}
                animate={{
                  x: isHovered ? ["-150%", "150%"] : "-150%",
                }}
                transition={{
                  duration: 1.5,
                  repeat: isHovered ? Infinity : 0,
                  ease: "linear",
                  repeatDelay: 1,
                }}
              />
              {/* Button Content */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <span>Xem chi tiết</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
