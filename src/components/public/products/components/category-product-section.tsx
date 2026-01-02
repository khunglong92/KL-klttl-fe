import { motion, AnimatePresence } from "framer-motion";
import { useProductsByCategory } from "../hooks/use-products-by-category";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCategoryRef, Product } from "@/services/api/productsService";
import { ProductCardProps } from "..";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/public/figma/ImageWithFallback";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface CategoryProductSectionProps {
  category: ProductCategoryRef;
  index?: number;
  titleStyle?: string;
  bgGradient?: string;
  borderColor?: string;
}

export function CategoryProductSection({
  category,
  index = 0,
  titleStyle = "text-3xl md:text-4xl font-extrabold tracking-tight text-white",
  bgGradient = "bg-linear-to-br from-slate-900/90 via-slate-900/75 to-indigo-900/80",
  borderColor = "border-white/10",
}: CategoryProductSectionProps) {
  const { products, isLoading } = useProductsByCategory(category.id);
  const { t, i18n } = useTranslation();

  const productCards = useMemo(
    () =>
      products.map((p: Product, i: number) => ({
        id: p.id,
        name: p.name,
        price: p.price ? parseFloat(p.price) : null,
        images: p.images ?? [],
        category: p.category
          ? { id: p.category.id, name: p.category.name }
          : undefined,
        description: p.description ?? null,
        index: i,
      })),
    [products]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(productCards.length / itemsPerPage));

  useEffect(() => {
    setCurrentIndex(0);
  }, [category.id]);

  // Don't render the section if there are no products and it's not loading
  if (!isLoading && products.length === 0) {
    return null;
  }

  const nextSlide = () => {
    if (currentIndex >= totalPages - 1) return;
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getCurrentProducts = () => {
    const start = currentIndex * itemsPerPage;
    return productCards.slice(start, start + itemsPerPage);
  };

  const formatPrice = (priceValue: number | string | null | undefined) => {
    if (!priceValue)
      return String(
        t("productsPage.category.contact", {
          defaultValue: "Liên hệ",
        })
      );

    const numericPrice =
      typeof priceValue === "string" ? parseFloat(priceValue) : priceValue;

    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "VND",
    }).format(numericPrice as number);
  };

  const previousLabel = String(
    t("common.previous", { defaultValue: "Previous" })
  );
  const nextLabel = String(t("common.next", { defaultValue: "Next" }));
  const detailLabel = String(
    t("productsPage.category.details", { defaultValue: "Chi tiết" })
  );
  const goToLabel = (indexNumber: number) =>
    String(
      t("productsPage.category.goTo", {
        defaultValue: "Go to slide {{index}}",
        index: indexNumber,
      })
    );

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-3xl border ${borderColor} text-white shadow-[0_25px_80px_-35px_rgba(8,47,73,0.75)]`}
    >
      <div className={`absolute inset-0 pointer-events-none ${bgGradient}`} />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.35),transparent_55%)]" />

      <div className="relative z-10 p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl"
        >
          <Badge className="px-4 py-2 bg-white/15 text-white border border-white/20 uppercase tracking-widest">
            {t("productsPage.category.badge", { defaultValue: "Danh mục" })}
          </Badge>
          <h2 className={`${titleStyle} mt-4 mb-3`}>{category.name}</h2>
          <p className="text-white/70 leading-relaxed">
            {t("productsPage.category.subtitle", {
              defaultValue:
                "Các sản phẩm được lựa chọn kỹ lưỡng đáp ứng tiêu chuẩn cao nhất.",
            })}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, j) => (
              <Skeleton
                key={j}
                className="h-[320px] w-full rounded-2xl bg-white/10"
              />
            ))}
          </div>
        ) : productCards.length > 0 ? (
          <div className="relative mt-10">
            {totalPages > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 border border-white/30 shadow-lg hover:bg-white/25 transition-all hover:scale-110 items-center justify-center"
                  aria-label={previousLabel}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentIndex === totalPages - 1}
                  className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 border border-white/30 shadow-lg hover:bg-white/25 transition-all hover:scale-110 items-center justify-center"
                  aria-label={nextLabel}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 250, damping: 30 },
                    opacity: { duration: 0.3 },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {getCurrentProducts().map((product) => (
                    <CategoryProductCard
                      key={product.id}
                      product={product}
                      formatPrice={formatPrice}
                      detailLabel={detailLabel}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => {
                      if (pageIndex === currentIndex) return;
                      setDirection(pageIndex > currentIndex ? 1 : -1);
                      setCurrentIndex(pageIndex);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      pageIndex === currentIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={goToLabel(pageIndex + 1)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

interface CategoryProductCardProps {
  product: ProductCardProps;
  formatPrice: (price?: number | string | null) => string;
  detailLabel: string;
}

function CategoryProductCard({
  product,
  formatPrice,
  detailLabel,
}: CategoryProductCardProps) {
  let descriptionText = "";
  if (Array.isArray(product.description)) {
    descriptionText = product.description[0] || "";
  } else if (typeof product.description === "string") {
    descriptionText = product.description;
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border border-white/15 bg-white/10 backdrop-blur-md text-left group">
        <div className="relative h-40 overflow-hidden">
          <ImageWithFallback
            src={product.images?.[0] || "https://via.placeholder.com/400"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
          {product.category?.name && (
            <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 px-3 py-1 border-0">
              {product.category.name}
            </Badge>
          )}
        </div>

        <CardContent className="p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {product.name}
          </h3>
          {descriptionText && (
            <p className="text-sm text-slate-300 mb-4 line-clamp-3">
              {descriptionText}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xl font-bold text-white">
              {formatPrice(product.price ?? null)}
            </span>
            <Link
              to="/products/$id"
              params={{ id: String(product.id) }}
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-amber-200 transition-colors"
            >
              {detailLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
