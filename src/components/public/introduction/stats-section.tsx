import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import contactBg from "@/images/common/contact-bg.jpg";

export interface StatItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface StatsSectionProps {
  stats: StatItem[];
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white/15 backdrop-blur-lg px-6 py-10 md:py-14 shadow-2xl border border-white/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex p-4 rounded-full bg-white/25 backdrop-blur-sm mb-4 group-hover:bg-white/35 transition-colors shadow-lg"
                  >
                    <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div
                      className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform"
                      style={{
                        textShadow:
                          "0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-white font-semibold text-sm md:text-base"
                      style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)" }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl" />
    </section>
  );
};
