import IntroPageLayout from "@/page/public/introduction/intro-page-layout";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Handshake, ShieldCheck, Zap, TrendingUp } from "lucide-react";

export const Partners = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const values = [
    {
      icon: <Handshake className="w-8 h-8 text-blue-500" />,
      title: theme === "dark" ? "Prestige" : "Uy tín",
      desc:
        theme === "dark"
          ? "Committed to all agreements"
          : "Cam kết thực hiện đúng mọi thỏa thuận",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      title: theme === "dark" ? "Transparency" : "Minh bạch",
      desc:
        theme === "dark"
          ? "Clear and honest cooperation"
          : "Hợp tác rõ ràng, trung thực",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: theme === "dark" ? "Efficiency" : "Hiệu quả",
      desc:
        theme === "dark"
          ? "Optimizing costs and time"
          : "Tối ưu hóa chi phí và thời gian",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      title: theme === "dark" ? "Mutual Development" : "Cùng phát triển",
      desc:
        theme === "dark"
          ? "Sustainable growth for both sides"
          : "Sự tăng trưởng bền vững cho cả hai bên",
    },
  ];

  return (
    <IntroPageLayout titleKey="introduction_pages.partners.title">
      <div
        className={`space-y-10 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        <div className="space-y-4">
          <p className="leading-relaxed text-lg text-justify font-medium italic border-l-4 border-red-500 pl-4 py-2 bg-red-50/30 dark:bg-navy-800/30 rounded-r-lg">
            {t("introduction_pages.partners.intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all hover:translate-y-[-5px] hover:shadow-lg ${
                theme === "dark"
                  ? "bg-navy-800 border-navy-700"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              <div className="flex justify-center items-center gap-x-3">
                <div className="mb-4">{item.icon}</div>
                <h4
                  className={`font-bold text-lg mb-2 text-center ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  {item.title}
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-center">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2 flex items-center gap-2">
            {theme === "dark" ? "Cooperation Fields" : "Lĩnh vực hợp tác"}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.partners.fields")}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2 flex items-center gap-2">
            {theme === "dark" ? "Cooperation Values" : "Giá trị hợp tác"}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.partners.collaboration")}
          </p>
        </section>

        <div
          className={`p-8 rounded-3xl text-center relative overflow-hidden ${
            theme === "dark"
              ? "bg-red-950/20 border border-red-900/50"
              : "bg-red-50 border border-red-100"
          }`}
        >
          <div className="relative z-10">
            <p className="text-xl font-bold text-[#CF0927] leading-relaxed italic">
              "{t("introduction_pages.partners.motto")}"
            </p>
          </div>
        </div>
      </div>
    </IntroPageLayout>
  );
};
