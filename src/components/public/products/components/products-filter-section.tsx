import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function ProductsFilterSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            {t("products.all.title", "Tất cả sản phẩm")}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-32 bg-border" />
            <div className="h-1 w-16 bg-linear-to-r from-transparent via-amber-500 to-transparent rounded-full" />
            <div className="h-px flex-1 max-w-32 bg-border" />
          </div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-center text-muted-foreground">
            {t(
              "products.all.subtitle",
              "Khám phá danh mục sản phẩm đa dạng của chúng tôi"
            )}
          </p>
        </motion.div>

        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">
            {t("common.comingSoon", "Tính năng đang được cập nhật...")}
          </p>
        </div>
      </div>
    </section>
  );
}
