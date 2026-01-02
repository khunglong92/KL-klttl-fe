import {
  Moon,
  Sun,
  Languages,
  ChevronDown,
  LogOut,
  Settings,
  Phone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import UserSetting from "./user-setting";
import CompanyLogoHeader from "./company-logo-header";
import companyLogo from "@/images/common/company-logo.png";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCategories } from "@/services/hooks/useCategories";
import { useFeaturedServices } from "@/services/hooks/useServices";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, Text } from "@mantine/core";
import { UserRole } from "@/stores/types";

export function Header({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHash, setActiveHash] = useState("#home");
  const { user, logout } = useAuthStore();

  // Fetch categories and services for dynamic nav
  const { data: categories = [] } = useCategories();
  const { data: servicesData } = useFeaturedServices(10);
  const services = useMemo(
    () => [...(servicesData?.pages.flatMap((page) => page.data) || [])],
    [servicesData]
  );

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
  const hoverTimeoutRef = useRef<any>(null);

  const handleMouseEnter = (itemName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150); // Delay to allow moving to content
  };
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
          { name: t("common.all", "Tất cả"), href: "/products" },
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
          { name: t("common.all", "Tất cả"), href: "/services" },
          ...services.map((svc) => ({
            name: svc.name,
            href: `/services/${svc.id}`,
          })),
        ],
      },
      { name: t("nav.project"), href: "/projects" },
      { name: t("nav.news"), href: "/news" },
      { name: t("nav.recruitment"), href: "/recruitment" },
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

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      const firstName = names[0];
      const lastName = names[names.length - 1];
      if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
      }
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/", replace: true });
  };

  // VISIBLE + FAST WAVE
  const waveVisible = {
    animate: {
      scale: [1, 1.45],
      opacity: [0.35, 0],
    },
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeOut",
    },
  };

  const iconPulse = {
    animate: {
      scale: [1, 1.12, 1],
    },
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <>
      <div className="hidden lg:block">
        <CompanyLogoHeader />
      </div>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-999 w-full border-b backdrop-blur shadow-sm ${theme === "light" ? "lg:bg-[#2980B9] bg-white" : "bg-black/50"}`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`flex h-16 items-center justify-between w-full ${theme === "light" ? "bg-transparent" : "bg-transparent"}`}
          >
            {/* Logo for mobile only */}
            {/* Left side: Phone Icon for Mobile */}
            <div className="lg:hidden">
              <a
                href="tel:0967853833"
                className="relative flex items-center justify-center w-8 h-8 rounded-full"
              >
                {/* Wave */}
                <motion.span
                  {...waveVisible}
                  className="absolute inset-0 rounded-full bg-red-500/40"
                />
                {/* Icon */}
                <motion.span
                  {...iconPulse}
                  className="relative z-10 flex items-center justify-center text-red-600"
                >
                  <Phone className="w-8 h-8" />
                </motion.span>
              </a>
            </div>

            {/* Center: Logo for Mobile */}
            <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <Link to="/" className="flex flex-col items-center">
                <AppThumbnailImage
                  src={companyLogo}
                  alt={t("nav.companyName")}
                  className="h-22 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right side content */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4 flex-1">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                {navItems.map((item, index) => {
                  const isActive = isNavItemActive(item.href);
                  const hasSubItems = "subItems" in item && item.subItems;

                  if (hasSubItems) {
                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
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
                                className={`inline-flex items-center justify-center rounded-full px-2 xl:px-4 py-2 text-sm transition-all outline-none border-none ring-0 focus:ring-0 group ${
                                  isActive
                                    ? `
                                       font-semibold scale-105
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
                                <span className="relative flex items-center gap-1 uppercase font-bold text-white text-[11px] lg:text-xs xl:text-sm 2xl:text-base whitespace-nowrap">
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
                              onMouseEnter={() => handleMouseEnter(item.name)}
                              onMouseLeave={handleMouseLeave}
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
                        className={`inline-flex items-center justify-center rounded-full px-2 xl:px-4 py-2 text-sm transition-all outline-none border-none ring-0 focus:ring-0 ${
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
                          className="relative block uppercase font-bold text-white text-[11px] lg:text-xs xl:text-sm 2xl:text-base whitespace-nowrap"
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

              {/* Actions for Desktop */}
              <div className="hidden lg:flex items-center gap-1 text-white font-bold text-xl">
                {/* Language Toggle */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={toggleLanguage}
                    className="rounded-full h-8 sm:h-10 px-2 sm:px-3 text-white hover:text-white"
                    title={
                      i18n.language === "vi"
                        ? t("nav.switchToEnglish", "Switch to English")
                        : t("nav.switchToVietnamese", "Chuyển sang Tiếng Việt")
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
                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-white"
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

                <UserSetting />
              </div>

              {/* Mobile Menu Trigger (Sheet) */}
              <div className="lg:hidden flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      >
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className={`w-full sm:w-[350px] p-0 overflow-y-auto ${theme === "dark" ? "bg-[#242830]" : "bg-white"}`}
                  >
                    <SheetHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                      <SheetDescription className="hidden">
                        Navigation Menu
                      </SheetDescription>
                      <SheetTitle className="text-left flex-1">
                        <div
                          onClick={() => navigate({ to: "/" })}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <AppThumbnailImage
                            src={companyLogo}
                            alt={t("nav.companyName")}
                            className="h-8 w-auto object-contain"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-sm uppercase leading-none text-gray-900 dark:text-gray-100">
                              {t("nav.companyName", "THIÊN LỘC")}
                            </span>
                          </div>
                        </div>
                      </SheetTitle>

                      <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <span className="sr-only">Close</span>
                        <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                          <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                        </div>
                      </SheetClose>
                      {/* Close button is handled by SheetPrimitive.Close, but we can ensure it's visible or add a custom one if needed. The default close button is absolute top-4 right-4. */}
                    </SheetHeader>

                    <div className="flex flex-col gap-1 p-4">
                      {/* User Layout for Mobile */}
                      {user && (
                        <div
                          className={`flex flex-col gap-4 mb-4 p-4 rounded-lg border ${theme === "dark" ? "text-white bg-[#242830]" : "text-black bg-white"}`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.avtUrl}
                              color={theme === "dark" ? "initials" : "orange"}
                              radius="xl"
                              size="md"
                              bg={theme === "dark" ? "gray" : "lime"}
                            >
                              {getInitials(user.name)}
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                              <Text
                                size="sm"
                                fw={700}
                                truncate
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {user.name}
                              </Text>
                              <Text size="xs" c="dimmed" truncate>
                                {user.email}
                              </Text>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {(user.role === UserRole.ADMIN ||
                              String(user.role).toUpperCase() === "ADMIN") && (
                              <SheetClose asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start gap-2"
                                  onClick={() =>
                                    navigate({ to: "/admin/dashboard" })
                                  }
                                >
                                  <Settings className="w-4 h-4" />
                                  {t("userMenu.settings", "Quản trị")}
                                </Button>
                              </SheetClose>
                            )}
                            <SheetClose asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={handleLogout}
                              >
                                {/* Intentional duplicate import workaround if exists, but we removed it. keeping usage normal */}
                                <LogOut className="w-4 h-4" />
                                {t("userMenu.logout", "Đăng xuất")}
                              </Button>
                            </SheetClose>
                          </div>
                        </div>
                      )}

                      <Accordion
                        type="single"
                        collapsible
                        className="w-full border-none"
                      >
                        {navItems.map((item) => {
                          const isActive = isNavItemActive(item.href);
                          const hasSubItems =
                            "subItems" in item && item.subItems;

                          if (hasSubItems) {
                            return (
                              <AccordionItem
                                key={item.name}
                                value={item.name}
                                className="border-none"
                              >
                                <AccordionTrigger
                                  className={cn(
                                    "rounded-lg px-4 py-3 font-bold hover:no-underline hover:bg-muted/50",
                                    isActive && "text-primary",
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-black"
                                  )}
                                >
                                  <div className="flex items-center gap-3 font-bold">
                                    {/* You can add icon here if available in navItems */}
                                    {item.name}
                                  </div>
                                </AccordionTrigger>
                                <hr
                                  className={
                                    theme === "dark"
                                      ? "border-gray-500"
                                      : "border-gray-200"
                                  }
                                />
                                <AccordionContent className="pb-2 pt-1 flex flex-col gap-1 px-4">
                                  {item.subItems.map((subItem) => (
                                    <Fragment key={subItem.href}>
                                      <SheetClose asChild>
                                        <Link
                                          to={subItem.href}
                                          className={`rounded-lg px-4 py-2 text-sm font-bold hover:bg-muted/50 transition-all block ${theme === "dark" ? "text-white" : "text-black"}`}
                                        >
                                          {subItem.name}
                                        </Link>
                                      </SheetClose>
                                      <hr
                                        className={
                                          theme === "dark"
                                            ? "border-gray-500"
                                            : "border-gray-200"
                                        }
                                      />
                                    </Fragment>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          }

                          return (
                            <SheetClose asChild key={item.name}>
                              <>
                                <Link
                                  to={item.href}
                                  aria-current={isActive ? "page" : undefined}
                                  className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 font-bold transition-all hover:bg-muted/50",
                                    isActive && "text-primary bg-primary/5",
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-black"
                                  )}
                                >
                                  {item.name}
                                </Link>
                                <hr
                                  className={
                                    theme === "dark"
                                      ? "border-gray-500"
                                      : "border-gray-200"
                                  }
                                />
                              </>
                            </SheetClose>
                          );
                        })}
                      </Accordion>
                    </div>

                    <SheetFooter
                      className={`mt-auto p-4 border-t flex flex-row items-center justify-between ${theme === "dark" ? "bg-[#242830]" : "bg-white"}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                      >
                        {theme === "light" ? (
                          <>
                            <Moon className="w-4 h-4" />
                            <span>{t("theme.dark", "Tối")}</span>
                          </>
                        ) : (
                          <>
                            <Sun className="w-4 h-4" />
                            <span>{t("theme.light", "Sáng")}</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className={`flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                      >
                        <Languages className="w-4 h-4" />
                        <span>{i18n.language.toUpperCase()}</span>
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
