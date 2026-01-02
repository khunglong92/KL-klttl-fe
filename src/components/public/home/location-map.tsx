import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import AppButton from "@/components/atoms/app-button";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { Skeleton } from "@/components/ui/skeleton";
import contactBg from "@/images/common/contact-bg.jpg";
import Ultils from "@/utils";

export function LocationMap() {
  const { t } = useTranslation();
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const { setCompanyInfo } = useContactInfoStore();

  // Lưu thông tin công ty vào Zustand store khi API trả về
  useEffect(() => {
    if (contactInfo) {
      setCompanyInfo(contactInfo);
    }
  }, [contactInfo, setCompanyInfo]);

  const contactDetails = [
    {
      icon: MapPin,
      titleKey: "location.address",
      value: contactInfo?.address || import.meta.env["VITE_COMPANY_ADDRESS"],
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Phone,
      titleKey: "location.phone",
      value: Ultils.formatPhoneNumber(
        contactInfo?.phone || import.meta.env["VITE_ZALO_PHONE_NUMBER"]
      ),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Mail,
      titleKey: "location.email",
      value: contactInfo?.email || import.meta.env["VITE_EMAIL_CONTACT"],
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Clock,
      titleKey: "location.workingHours",
      value:
        contactInfo?.workingHours ||
        import.meta.env["VITE_COMPANY_WORKING_HOURS"],
      color: "from-green-500 to-emerald-600",
    },
  ];
  const tmp = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5010.110085193075!2d105.75442684335644!3d21.110013180906854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455460860fd87%3A0x7215ee9bfc20f9cd!2zVuG6vSB0cmFuaCB0xrDhu51uZywgU8ahbiBoaeG7h3Ug4bupbmcgbmdo4buHIHRodeG6rXQ!5e0!3m2!1sen!2s!4v1763544315569!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  const mapSrc = Ultils.extractSrcFromIframe(contactInfo?.googleMapUrl || tmp);

  return (
    <section
      id="location"
      className="relative py-16 md:py-24 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex justify-center items-center font-bold">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 backdrop-blur-md w-fit px-10 py-5"
          >
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t("location.title")}
            </h2>
            <p className="text-gray-600 dark:text-white/80 max-w-2xl mx-auto text-base md:text-lg">
              {t("location.description")}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-bold">
              {isLoading && <ContactGridSkeleton />}

              {!isLoading &&
                contactDetails.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.titleKey}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-white/5 dark:backdrop-blur-md hover:ring-1 hover:ring-primary/50 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-white/10 flex items-start gap-4 justify-center"
                    >
                      <div
                        className={`relative p-3 rounded-lg bg-linear-to-br ${info.color} shrink-0 shadow-lg`}
                      >
                        <Icon className="relative h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-md font-semibold mb-1 text-gray-800 dark:text-white/90">
                          {t(info.titleKey)}
                        </h4>
                        <p className="text-gray-600 dark:text-white/70 text-sm">
                          {info.value || "Đang cập nhật..."}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Consultation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-white/5 dark:backdrop-blur-md  rounded-2xl p-8 shadow-xl hover:ring-1 hover:ring-primary/50"
            >
              <div className="relative z-10">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {t("location.consultationTitle")}
                </h3>
                <p className="mb-6 text-gray-600 dark:text-white/80 leading-relaxed">
                  {t("location.consultationDescription")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <AppButton
                    to={`tel:${contactInfo?.phone}`}
                    label={t("location.callNow")}
                    size="lg"
                    variant="default"
                    leftSection={<Phone className="h-5 w-5" />}
                    showArrow={false}
                  />
                  <AppButton
                    to={`mailto:${contactInfo?.email}`}
                    label={t("location.sendEmail")}
                    size="lg"
                    variant="outline"
                    leftSection={<Mail className="h-5 w-5" />}
                    showArrow={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[500px]">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[500px]"
                  title="Thiên Lộc Location"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-white/50">
                    Bản đồ đang được cập nhật.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactGridSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 dark:bg-white/5 rounded-2xl p-6 space-y-4"
        >
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}
