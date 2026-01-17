import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import companyLogo from "@/images/common/company-logo.png";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import { Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/styles/floating-buttons.css";

export default function CompanyLogoHeader() {
  const { t } = useTranslation();

  const companyPhone = import.meta.env["VITE_COMPANY_PHONE"] || "0967853833";
  const companyEmail =
    import.meta.env["VITE_EMAIL_CONTACT"] || "kimloaitamthienloc@gmail.com";

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-0">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          {/* ================= EMAIL ================= */}
          <div className="flex flex-col justify-center items-center">
            <span className="text-lg font-bold uppercase tracking-wide text-gray-700 mb-1">
              {t("nav.emailContact")}
            </span>

            <a
              href={`mailto:${companyEmail}`}
              className="flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-blue-600 transition group"
            >
              {/* Mini Ring Effect - Blue */}
              <div className="hotline-mini-ring-wrap">
                <div className="hotline-mini-ring-circle blue"></div>
                <div className="hotline-mini-ring-circle-fill blue"></div>
                <div className="hotline-mini-ring-img-circle blue">
                  <Mail className="h-5 w-5 text-white" />
                </div>
              </div>

              <span className="underline underline-offset-4 text-blue-500">
                {companyEmail}
              </span>
            </a>
          </div>

          {/* ================= LOGO ================= */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <Link
              to="/"
              className="flex items-center gap-4 text-center md:text-left"
            >
              <AppThumbnailImage
                src={companyLogo}
                alt={t("nav.companyName")}
                width="128"
                height="128"
                className="h-28 md:h-32 w-auto"
              />

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t("nav.companyName")}
                </h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  {t("nav.companyDescription")}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* ================= PHONE ================= */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold uppercase tracking-wide text-gray-700 mb-1">
              {t("nav.phoneContact")}
            </span>

            <a
              href={`tel:${companyPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-base font-semibold hover:text-red-600 transition group"
            >
              {/* Mini Ring Effect - Red */}
              <div className="hotline-mini-ring-wrap">
                <div className="hotline-mini-ring-circle"></div>
                <div className="hotline-mini-ring-circle-fill"></div>
                <div className="hotline-mini-ring-img-circle">
                  <Phone className="h-5 w-5 text-white" />
                </div>
              </div>

              <span className="text-red-600 font-semibold tracking-wide">
                {formatPhoneNumber(companyPhone)}
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
