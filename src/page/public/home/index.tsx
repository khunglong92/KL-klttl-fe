import { Toaster } from "sonner";
import { Hero } from "@/components/public/home/hero";
import { AboutSection } from "@/components/public/home/about-section";
import { FeaturedProducts } from "@/components/public/home/featured-products";
import { FeaturedServices } from "@/components/public/home/featured-services";
import { LocationMap } from "@/components/public/home/location-map";
import { ProjectsSection } from "@/components/public/home/projects-section";
import { PartnersSection } from "@/components/public/home/partners-section";
import { useState } from "react";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const [showProjects] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={t("nav.home")} description={t("hero.description")} />
      <main>
        <Hero />
        <AboutSection />
        <FeaturedProducts />
        <FeaturedServices />
        <PartnersSection />
        <LocationMap />
        <ProjectsSection isVisible={showProjects} />
      </main>
      <Toaster />
    </div>
  );
}
