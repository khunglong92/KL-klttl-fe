import { Toaster } from "sonner";
import { Hero } from "@/components/public/home/hero";
import { AboutSection } from "@/components/public/home/about-section";
import { FeaturedProducts } from "@/components/public/home/featured-products";
import { FeaturedServices } from "@/components/public/home/featured-services";
import { FeaturedNews } from "@/components/public/home/featured-news";
import { FeaturedRecruitment } from "@/components/public/home/featured-recruitment";
import { FeaturedPriceQuotes } from "@/components/public/home/featured-price-quotes";
import { ProjectsSection } from "@/components/public/home/projects-section";
import { useState } from "react";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";
import { FeaturedProjects } from "@/components/public/home/featured-projects";

export default function Home() {
  const { t } = useTranslation();
  const [showProjects] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={t("nav.home")} description={t("hero.description")} />
      <main className="w-full md:w-[75%] mx-auto">
        <Hero />
        <AboutSection />
        <FeaturedProducts />
        <FeaturedServices />
        <FeaturedProjects />
        <FeaturedNews />
        <FeaturedRecruitment />
        <FeaturedPriceQuotes />
        <ProjectsSection isVisible={showProjects} />
      </main>
      <Toaster />
    </div>
  );
}
