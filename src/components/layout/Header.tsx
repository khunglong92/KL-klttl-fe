import { Moon, Sun, Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Link, useLocation } from "@tanstack/react-router";
import UserSetting from "./user-setting";
import CompanyLogoHeader from "./company-logo-header";

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

  // Navigation items with hash-based links
  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.introduction"), href: "/introduction" },
    { name: t("nav.products"), href: "/products" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.project"), href: "/projects" },
    { name: t("nav.quote"), href: "/quote" },
    { name: t("nav.contact"), href: "/contact" },
  ] as const;

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLanguage);
  };

  // Check if a nav item is active based on hash
  const isNavItemActive = (href: string) => {
    if (href.startsWith("/")) {
      return location.pathname === href;
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
                          ? "bg-primary text-primary-foreground font-semibold shadow-md dark:shadow-primary/20 border-2 border-primary/20 dark:border-primary/30 scale-105"
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
              <div className="flex flex-col gap-4 py-4">
                {navItems.map((item) => {
                  const isActive = isNavItemActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 transition-all font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md dark:shadow-primary/20 border-l-4 border-primary font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
