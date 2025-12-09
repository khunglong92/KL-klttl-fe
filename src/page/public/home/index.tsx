import { Toaster } from "sonner";
import { Hero } from "@/components/public/home/hero";
import { AboutSection } from "@/components/public/home/about-section";
import { FeaturedProducts } from "@/components/public/home/featured-products";
import { FeaturedServices } from "@/components/public/home/featured-services";
import { LocationMap } from "@/components/public/home/location-map";
import { ProjectsSection } from "@/components/public/home/projects-section";
import { useState } from "react";

export default function Home() {
  const [showProjects] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <AboutSection />
        <FeaturedProducts />
        <FeaturedServices />
        <LocationMap />
        <ProjectsSection isVisible={showProjects} />
      </main>
      <Toaster />
    </div>
  );
}
