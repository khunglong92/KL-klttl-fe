import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@tanstack/react-router";
import companyLogo from "@/images/common/company-logo.png";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import zaloImage from "@/images/contacts/zalo.svg";
import phoneImage from "@/images/contacts/phone.svg";
import { useTheme } from "@/hooks/useTheme";

import { useEffect } from "react";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { PremiumContactButton } from "@/components/public/common/premium-contact-button";

export function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme } = useTheme();

  // Fetch company info from API
  const { data } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (data) {
      setCompanyInfo(data);
    }
  }, [data, setCompanyInfo]);

  const envCompanyPhone = import.meta.env["VITE_COMPANY_PHONE"] || "0967853833";
  const envCompanyEmail =
    import.meta.env["VITE_EMAIL_CONTACT"] || "kimloaitamthienloc@gmail.com";

  // Use API data if available, otherwise fallback to env vars
  const companyPhone = companyInfo?.phone || envCompanyPhone;
  const companyEmail = companyInfo?.email || envCompanyEmail;
  const companyAddress = companyInfo?.address;

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    }
    return phone;
  };

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.introduction"), href: "/introduction" },
    { name: t("nav.products"), href: "/products" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.news"), href: "/news" },
    { name: t("nav.recruitment"), href: "/recruitment" },
    { name: t("nav.quote"), href: "/quote" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const contactMethods = [
    {
      name: "Zalo",
      imageSrc: zaloImage,
      href: `https://zalo.me/${companyPhone}`,
      color: "#0068ff",
    },
    {
      name: "Hotline",
      imageSrc: phoneImage,
      href: `tel:${companyPhone}`,
      color: "#e60808",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61587042855232",
      color: "#1877f2",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:${companyEmail}`,
      color: "#ea4335",
    },
  ];

  if (location.pathname.includes("/admin")) return null;

  return (
    <footer
      id="contact"
      className="bg-muted/50 text-gray-800 dark:text-white border-t border-gray-200 dark:border-white/10"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 justify-between gap-x-32 items-center">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-32 w-32 rounded-xl flex items-center justify-center">
                <AppThumbnailImage
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-32 h-32"
                />
              </div>
              <div
                className={`flex flex-col leading-tight ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                <span className="text-2xl font-bold">THIÊN LỘC</span>
                <span className="text-sm font-bold">
                  SX & GIA CÔNG KIM LOẠI TẤM
                </span>
              </div>
            </div>
            <p
              className={`text-base font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
            >
              {t("about.description")}
            </p>
            <div className="space-y-2 text-base font-bold">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                <span
                  className={`${theme === "dark" ? "text-white/80" : "text-gray-700"}`}
                >
                  {companyAddress || t("location.addressValue")}
                </span>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-amber-500" />
                  <a
                    href={`tel:${companyPhone}`}
                    aria-label={`Call ${companyPhone}`}
                    className={`${theme === "dark" ? "text-white/80" : "text-gray-700"} hover:text-amber-500 dark:hover:text-amber-400 transition-colors`}
                  >
                    {formatPhoneNumber(companyPhone)}
                  </a>
                </div>
                <a
                  href={`tel:${"0372622161"}`}
                  aria-label={`Call ${"0372622161"}`}
                  className={`${theme === "dark" ? "text-white/80" : "text-gray-700"} hover:text-amber-500 dark:hover:text-amber-400 transition-colors space-x-2`}
                >
                  <span className="text-sm font-bold">SALE: </span>
                  <span className="text-sm font-bold">
                    {formatPhoneNumber("0372622161")}
                  </span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500" />
                <a
                  href={`mailto:${companyEmail}`}
                  aria-label={`Email ${companyEmail}`}
                  className={`${theme === "dark" ? "text-white/80" : "text-gray-700"} hover:text-amber-500 dark:hover:text-amber-400 transition-colors`}
                >
                  {companyEmail}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3
              className={`mb-4 font-semibold text-2xl text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("footer.quickLinks")}
            </h3>
            <ul
              className={`space-y-2 grid grid-cols-3 gap-2 text-center font-bold underline ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
            >
              {navItems.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-base font-bold ${theme === "dark" ? "text-white/70" : "text-gray-600"} hover:text-amber-500 dark:hover:text-amber-400 transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3
              className={`mb-4 font-bold text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("footer.contactUs")}
            </h3>
            <p
              className={`text-base font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
            >
              {t("footer.contactDescription")}
            </p>
            <div className="flex items-center gap-3 pt-3">
              {contactMethods.map((method) => (
                <PremiumContactButton
                  key={method.name}
                  Icon={method.icon}
                  imageSrc={method.imageSrc}
                  color={method.color}
                  href={method.href}
                  title={method.name}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"} pt-6 mt-8`}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center w-full">
            <p
              className={`text-sm ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}
            >
              © {new Date().getFullYear()} THIÊN LỘC. {t("footer.copyright")}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
