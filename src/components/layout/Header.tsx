import { Moon, Sun, Menu, X, Languages, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

import { Link, useLocation } from "@tanstack/react-router";
import UserSetting from "./user-setting";
import CompanyLogoHeader from "./company-logo-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCategories } from "@/services/hooks/useCategories";
import { useFeaturedServices } from "@/services/hooks/useServices";

export function Header({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [activeHash, setActiveHash] = useState("#home");

  // Fetch categories and services for dynamic nav
  const { data: categories = [] } = useCategories();
  const { data: servicesData } = useFeaturedServices(10);
  const services = servicesData?.pages.flatMap((page) => page.data) || [];

  // Update active hash when URL changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#home");
    };

    // Set initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Build dynamic nav items with categories and services
  const navItems = useMemo(
    () => [
      { name: t("nav.home"), href: "/" },
      {
        name: t("nav.introduction"),
        href: "/introduction",
        subItems: [
          { name: t("nav.introduction_general"), href: "/introduction" },
          {
            name: t("nav.introduction_profile"),
            href: "/introduction/company-profile",
          },
          {
            name: t("nav.introduction_facilities"),
            href: "/introduction/facilities",
          },
          {
            name: t("nav.introduction_partners"),
            href: "/introduction/partners",
          },
          {
            name: t("nav.introduction_privacy"),
            href: "/introduction/privacy-policy",
          },
        ],
      },
      {
        name: t("nav.products"),
        href: "/products",
        subItems: [
          { name: t("common.all") || "Tất cả", href: "/products" },
          ...categories.map((cat) => ({
            name: cat.name,
            href: `/products?categoryId=${cat.id}`,
          })),
        ],
      },
      {
        name: t("nav.services"),
        href: "/services",
        subItems: [
          { name: t("common.all") || "Tất cả", href: "/services" },
          ...services.map((svc) => ({
            name: svc.title,
            href: `/services/${svc.slug}`,
          })),
        ],
      },
      { name: t("nav.project"), href: "/projects" },
      { name: t("nav.quote"), href: "/quote" },
      { name: t("nav.contact"), href: "/contact" },
    ],
    [t, categories, services]
  );

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLanguage);
  };

  // Check if a nav item is active based on hash
  const isNavItemActive = (href: string) => {
    const parts = href.split("?");
    const pathOnly = parts[0];
    if (pathOnly && pathOnly.startsWith("/")) {
      return location.pathname === pathOnly;
    }
    return (
      activeHash === href ||
      (activeHash === "#home" && href === "#home" && location.pathname === "/")
    );
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur shadow-sm ${theme === "light" ? "bg-[#2980B9]" : "bg-black/50"}`}
    >
      <CompanyLogoHeader />
      <div className="container mx-auto px-4">
        <div
          className={`flex h-16 items-center justify-center w-full ${theme === "light" ? "bg-[#2980B9]" : "bg-black/50"}`}
        >
          {/* Right side content */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = isNavItemActive(item.href);
                const hasSubItems = "subItems" in item && item.subItems;

                if (hasSubItems) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <DropdownMenu
                          open={hoveredItem === item.name}
                          modal={false}
                        >
                          <DropdownMenuTrigger asChild>
                            <Link
                              to={item.href}
                              className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 group ${
                                isActive
                                  ? `
                                        bg-primary text-primary-foreground font-semibold scale-105
                                        shadow-[0_0_10px_rgba(0,0,0,0.15)]
                                        ${
                                          theme === "dark"
                                            ? "shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                                            : "shadow-[0_0_10px_rgba(0,0,0,0.15)]"
                                        }
                                      `
                                  : "text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground hover:scale-105"
                              }`}
                            >
                              <span className="relative flex items-center gap-1 uppercase font-bold text-white text-lg">
                                {item.name}
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    hoveredItem === item.name && "rotate-180"
                                  )}
                                />
                              </span>
                            </Link>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="center"
                            sideOffset={0}
                            className={cn(
                              "w-56 shadow-xl rounded-xl p-2 border",
                              theme === "dark"
                                ? "bg-[#1a2742] border-[#2d3f5e]"
                                : "bg-white border-gray-200"
                            )}
                          >
                            {item.subItems.map((subItem) => (
                              <DropdownMenuItem
                                key={subItem.href}
                                asChild
                                className={cn(
                                  "focus:bg-accent focus:text-accent-foreground rounded-lg cursor-pointer",
                                  theme === "dark"
                                    ? "hover:bg-[#2d3f5e]"
                                    : "hover:bg-gray-100"
                                )}
                              >
                                <Link
                                  to={subItem.href}
                                  className={cn(
                                    "w-full px-3 py-2 text-sm font-semibold uppercase hover:text-accent-red transition-colors",
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-700"
                                  )}
                                >
                                  {subItem.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={item.name}
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 ${
                        isActive
                          ? `
                            bg-primary text-primary-foreground font-semibold scale-105
                            shadow-[0_0_10px_rgba(0,0,0,0.15)]
                            ${
                              theme === "dark"
                                ? "shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                                : "shadow-[0_0_10px_rgba(0,0,0,0.15)]"
                            }
                          `
                          : "text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground hover:scale-105"
                      }`}
                    >
                      <motion.span
                        className="relative block uppercase font-bold text-white text-lg"
                        whileHover={{ y: -1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 14,
                        }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 text-white font-bold text-xl">
              {/* Language Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="rounded-full h-8 sm:h-10 px-2 sm:px-3"
                  title={
                    i18n.language === "vi"
                      ? "Switch to English"
                      : "Chuyển sang Tiếng Việt"
                  }
                >
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Languages className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={i18n.language}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] sm:text-xs font-semibold whitespace-nowrap inline-block"
                      >
                        {i18n.language.toUpperCase()}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </Button>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                >
                  <AnimatePresence mode="wait">
                    {theme === "light" ? (
                      <motion.div
                        key="moon"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            <UserSetting />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-4">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-none"
                >
                  {navItems.map((item) => {
                    const isActive = isNavItemActive(item.href);
                    const hasSubItems = "subItems" in item && item.subItems;

                    if (hasSubItems) {
                      return (
                        <AccordionItem
                          key={item.name}
                          value={item.name}
                          className="border-none"
                        >
                          <AccordionTrigger
                            className={cn(
                              "rounded-lg px-4 py-3 font-bold uppercase transition-all hover:no-underline text-white hover:bg-accent/20",
                              isActive && "bg-white/10"
                            )}
                          >
                            {item.name}
                          </AccordionTrigger>
                          <AccordionContent className="pb-2 pt-1 flex flex-col gap-1 px-4">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-4 py-2 text-sm font-semibold uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={isActive ? "page" : undefined}
                        data-active={isActive}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-lg px-4 py-3 transition-all font-bold uppercase ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md dark:shadow-primary/20 border-l-4 border-primary"
                            : "text-white hover:bg-accent/20 hover:translate-x-1"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </Accordion>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
