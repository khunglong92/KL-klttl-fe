import { motion, AnimatePresence, wrap } from "framer-motion";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AppThumbnailImage } from "../common/app-thumbnail-image";
import heroBg from "@/images/common/hero-section-bg.jpg";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useCompanyIntros } from "@/services/hooks/useCompanyIntros";
import type { CompanyIntro } from "@/services/api/companyIntroService";

// Fallback slides
const fallbackSlides = [
  {
    id: "fallback-1",
    url: heroBg,
    description:
      "Khám phá bộ sưu tập đồ gỗ và nhựa cao cấp cho ngôi nhà của bạn",
    subDescription: "Chất lượng cao • Giá tốt nhất",
  },
  {
    id: "fallback-2",
    url: heroBg,
    description: "Giải pháp gia công kim loại toàn diện với độ chính xác cao",
    subDescription: "Chuyên nghiệp • Chính xác • Hoàn hảo",
  },
];

interface HeroSlide {
  id: string;
  url: string;
  description?: string | null;
  subDescription?: string | null;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function Hero() {
  const { t } = useTranslation();
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch company intros
  const { data: companyIntros, isLoading } = useCompanyIntros();

  const heroSlides = useMemo<HeroSlide[]>(() => {
    if (!companyIntros || companyIntros.length === 0) {
      return fallbackSlides;
    }
    return companyIntros.map((intro: CompanyIntro) => ({
      id: intro.id,
      url: intro.url,
      description: intro.description,
      subDescription: intro.subDescription,
    }));
  }, [companyIntros]);

  const slideIndex = wrap(0, heroSlides.length, page);

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  const goToSlide = (index: number) => {
    const direction = index > slideIndex ? 1 : -1;
    setPage([index, direction]);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-slide
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, paginate, heroSlides.length]);

  const currentSlideData = heroSlides[slideIndex];

  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-navy-900 grid place-items-center">
        <div className="animate-pulse text-white text-xl">Đang tải...</div>
      </section>
    );
  }

  if (!currentSlideData) return null;

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-navy-900">
      {/* Background Slider */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          <AppThumbnailImage
            src={currentSlideData.url}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Enhanced Overlay: gradient darker on left for text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-navy-950/90 via-navy-900/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center pointer-events-none">
        <div className="max-w-4xl w-full pointer-events-auto">
          {/* Dynamic Text */}
          <div className="min-h-[200px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Description - Main Title Style */}
                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                  {currentSlideData.description || t("about.title")}
                </h1>

                {/* Sub Description with Navigation */}

                <p className="text-white text-xl  font-bold leading-tight drop-shadow-lg">
                  {currentSlideData.subDescription}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Static Buttons */}
          <div className="absolute bottom-20 left-0 flex flex-col sm:flex-row gap-4 z-10">
            <AppButton
              label={t("about.viewProducts")}
              to="/products"
              size="lg"
              variant="default"
              className="bg-accent-red hover:bg-accent-red-700 text-white shadow-lg hover:shadow-xl transition-all border-none"
              rightSection={<ArrowRight className="h-5 w-5" />}
            />
            <AppButton
              label={t("about.viewServices")}
              to="/services"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              rightSection={<ArrowRight className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>

      {/* Pagination - Dots */}
      <div className="absolute bottom-6 left-0 w-full z-20 flex justify-center py-4">
        <div className="flex gap-4 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-lg">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ease-out ${
                index === slideIndex
                  ? "bg-white h-2 w-8"
                  : "bg-white/40 h-2 w-2 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className=" absolute top-1/2 px-10 left-0 flex items-center w-full justify-between gap-4 md:gap-12 mt-6 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className="group p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className="group p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>
    </section>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
