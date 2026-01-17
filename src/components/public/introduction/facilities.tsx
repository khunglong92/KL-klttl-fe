import IntroPageLayout from "@/page/public/introduction/intro-page-layout";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Phone } from "lucide-react";
import Ultils from "@/utils";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useEffect } from "react";

export const Facilities = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Fetch contact info
  const { data: contactInfo } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (contactInfo) {
      setCompanyInfo(contactInfo);
    }
  }, [contactInfo, setCompanyInfo]);

  const companyPhone =
    companyInfo?.phone || import.meta.env["VITE_COMPANY_PHONE"] || "0967853833";
  const companyEmail =
    companyInfo?.email ||
    import.meta.env["VITE_EMAIL_CONTACT"] ||
    "kimloaitamthienloc@gmail.com";

  // Helper to check if HTML has actual content (not just empty tags)
  const hasContent = (html: string | undefined | null): boolean => {
    if (!html) return false;
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length > 0;
  };

  return (
    <IntroPageLayout titleKey="introduction_pages.facilities.title">
      <div
        className={`space-y-8 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {hasContent(companyInfo?.facilitiesIntro) ? (
          <>
            <style>{`
              .facilities-content {
                color: inherit;
              }
              /* Chỉ h2 mới là tiêu đề với gạch đỏ */
              .facilities-content > h2 {
                color: #CF0927 !important;
                font-weight: bold;
                border-bottom: 2px solid #fee2e2;
                padding-bottom: 0.5rem;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                font-size: 1.25em;
              }
              .facilities-content > h2 strong {
                color: inherit;
              }
              /* h3, h4 hiển thị như paragraph thường */
              .facilities-content > h3,
              .facilities-content > h4 {
                color: inherit;
                font-weight: normal;
                font-size: 1em;
                margin-bottom: 0.75em; 
                line-height: 1.7; 
                text-align: justify;
                border: none;
                padding: 0;
              }
              .facilities-content > p { 
                margin-bottom: 0.75em; 
                line-height: 1.7; 
                text-align: justify;
                color: inherit;
                font-weight: normal;
              }
              .facilities-content > ul { 
                list-style-type: disc; 
                padding-left: 1.5em; 
                margin-bottom: 0.75em; 
              }
              .facilities-content > ol { 
                list-style-type: decimal; 
                padding-left: 1.5em; 
                margin-bottom: 0.75em; 
              }
              .facilities-content li { 
                margin-bottom: 0.25em; 
                line-height: 1.6;
                color: inherit;
                font-weight: normal;
              }
              .facilities-content strong { font-weight: bold; }
            `}</style>
            <div
              className="facilities-content max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: companyInfo!.facilitiesIntro!,
              }}
            />
          </>
        ) : (
          <>
            <p className="leading-relaxed text-justify">
              {t("introduction_pages.facilities.intro")}
            </p>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2">
                {t("introduction_pages.facilities.section_a.title")}
              </h3>
              <p className="leading-relaxed text-justify">
                {t("introduction_pages.facilities.section_a.p1")}
              </p>
              <p className="leading-relaxed text-justify">
                {t("introduction_pages.facilities.section_a.p2")}
              </p>
              <p className="leading-relaxed text-justify">
                {t("introduction_pages.facilities.section_a.p3")}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2">
                {t("introduction_pages.facilities.section_b.title")}
              </h3>
              <p className="leading-relaxed text-justify">
                {t("introduction_pages.facilities.section_b.content")}
              </p>
            </section>
          </>
        )}

        {/* Địa chỉ văn phòng - luôn hiển thị */}
        <div
          className={`p-4 rounded-lg border-l-4 border-red-500 ${theme === "dark" ? "bg-navy-800" : "bg-red-50"}`}
        >
          <span className="font-bold block mb-2 text-lg text-red-700 dark:text-red-400">
            {t(
              "introduction_pages.facilities.section_b.address_label",
              "Địa chỉ văn phòng giao dịch:"
            )}
          </span>
          <span className="text-lg italic">
            {companyInfo?.address ||
              t("introduction_pages.facilities.section_b.address_value")}
          </span>
        </div>

        <section className="space-y-4 pt-4">
          <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2">
            {t("introduction_pages.facilities.section_c.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-6 rounded-xl border text-center transition-all hover:shadow-md ${
                theme === "dark"
                  ? "bg-navy-800 border-navy-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("introduction_pages.facilities.section_c.phone_label")}
              </div>
              <div className="flex gap-x-4 justify-center items-center">
                <a href={`tel:${companyPhone}`}>
                  {/* Mini Ring Effect - Red */}
                  <div className="hotline-mini-ring-wrap">
                    <div className="hotline-mini-ring-circle"></div>
                    <div className="hotline-mini-ring-circle-fill"></div>
                    <div className="hotline-mini-ring-img-circle">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </a>
                <a
                  href="tel:0967853833"
                  className="text-xl font-black text-red-600 dark:text-red-500 hover:text-red-700 transition-colors"
                >
                  {Ultils.formatPhoneNumber(companyPhone)}
                </a>
              </div>
            </div>
            <div
              className={`p-6 rounded-xl border text-center transition-all hover:shadow-md ${
                theme === "dark"
                  ? "bg-navy-800 border-navy-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("introduction_pages.facilities.section_c.email_label")}
              </div>
              <a
                href="mailto:kimloaitamthienloc@gmail.com"
                className="text-xl font-bold text-blue-600 underline dark:text-blue-400 hover:text-blue-700 transition-colors break-all"
              >
                {companyEmail}
              </a>
            </div>
          </div>
        </section>
      </div>
    </IntroPageLayout>
  );
};
