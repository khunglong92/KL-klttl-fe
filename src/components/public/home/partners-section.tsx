import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Partner logos - can be replaced with actual partner logos from API or assets
const partners = [
  { id: 1, name: "Samsung", logoPlaceholder: "SAMSUNG" },
  { id: 2, name: "Delta", logoPlaceholder: "DELTA" },
  { id: 3, name: "Coteccons", logoPlaceholder: "COTECCONS" },
  { id: 4, name: "Hòa Phát", logoPlaceholder: "HÒA PHÁT" },
  { id: 5, name: "Vingroup", logoPlaceholder: "VINGROUP" },
  { id: 6, name: "Mường Thanh", logoPlaceholder: "MƯỜNG THANH" },
  { id: 7, name: "FLC", logoPlaceholder: "FLC" },
  { id: 8, name: "Sun Group", logoPlaceholder: "SUN GROUP" },
];

export function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 bg-linear-to-b from-navy-50 to-white dark:from-navy-900/20 dark:to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-1 bg-accent-red rounded-full" />
            <span className="text-accent-red font-semibold uppercase tracking-wider text-sm">
              {t("partners.subtitle", "Đối tác tin cậy")}
            </span>
            <div className="w-8 h-1 bg-accent-red rounded-full" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white">
            {t("partners.title", "Đối Tác & Khách Hàng")}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            {t(
              "partners.description",
              "Chúng tôi tự hào được hợp tác với các thương hiệu hàng đầu"
            )}
          </p>
        </motion.div>

        {/* Partners Slider - Infinite scroll */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white dark:from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white dark:from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8 items-center"
              animate={{ x: [0, -1920] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Double the partners for seamless loop */}
              {[...partners, ...partners].map((partner, index) => (
                <div key={`${partner.id}-${index}`} className="shrink-0 group">
                  <div className="w-40 h-20 bg-white dark:bg-navy-800/50 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center px-4 py-3 transition-all duration-300 border border-gray-100 dark:border-navy-700 grayscale hover:grayscale-0 hover:scale-105">
                    <span className="text-lg font-bold text-navy-600 dark:text-navy-300 group-hover:text-navy dark:group-hover:text-white transition-colors whitespace-nowrap">
                      {partner.logoPlaceholder}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
        >
          {[
            { value: "500+", label: t("partners.stat1", "Dự án hoàn thành") },
            { value: "100+", label: t("partners.stat2", "Đối tác tin cậy") },
            { value: "10+", label: t("partners.stat3", "Năm kinh nghiệm") },
            { value: "24/7", label: t("partners.stat4", "Hỗ trợ khách hàng") },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="text-center p-4 rounded-xl bg-white dark:bg-navy-800/30 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-accent-red mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
