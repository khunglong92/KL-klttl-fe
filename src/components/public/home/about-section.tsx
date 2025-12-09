import { motion } from "framer-motion";
import { Users, Package, Star, Award } from "lucide-react";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";

import { useTranslation } from "react-i18next";
import introAboutImage from "@/images/common/intro-about.jpg";

export function AboutSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Package,
      value: "500+",
      labelKey: "about.stats.products",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      value: "1,000+",
      labelKey: "about.stats.customers",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Star,
      value: "4.9/5",
      labelKey: "about.stats.rating",
      color: "from-yellow-400 to-amber-500",
    },
    {
      icon: Award,
      value: "10+",
      labelKey: "about.stats.experience",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <AppThumbnailImage
                src={introAboutImage}
                alt="Thiên Lộc - Gia công kim loại tấm"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"
              />

              {/* Stats Grid on Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-3"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.labelKey}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        boxShadow:
                          "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                      }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 min-h-[80px] flex flex-col justify-center items-center cursor-pointer transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                    >
                      {/* Glow effect - similar to "Xem dịch vụ" button */}
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-xl bg-white/15 blur-lg z-0"
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
                      <motion.div
                        className={`inline-flex p-2 rounded-lg bg-linear-to-br ${stat.color} mb-2 relative z-10 ${
                          stat.icon === Star ? "overflow-visible" : ""
                        }`}
                        animate={
                          stat.icon === Star
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 15, -15, 0],
                              }
                            : {}
                        }
                        transition={
                          stat.icon === Star
                            ? {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                            : {}
                        }
                      >
                        <Icon
                          className={`h-4 w-4 text-white ${
                            stat.icon === Star
                              ? "drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]"
                              : ""
                          }`}
                        />
                        {stat.icon === Star && (
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-yellow-400/50 blur-md -z-10"
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                              scale: [1, 1.5, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </motion.div>
                      <div className="space-y-0.5 text-center relative z-10">
                        <div className="text-lg font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/70">
                          {t(stat.labelKey)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-linear-to-br from-amber-500 to-orange-600 rounded-full opacity-20 blur-2xl"
            />
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="mb-6 text-3xl md:text-4xl font-bold">
                {t("about.sectionTitle")}
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {t("about.paragraph1")}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {t("about.paragraph2")}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {t("about.paragraph3")}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {t("about.paragraph4")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
