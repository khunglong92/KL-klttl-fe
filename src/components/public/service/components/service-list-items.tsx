import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { CompanyService } from "@/services/api/servicesService";
import { Badge } from "@/components/ui/badge";

import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { AppThumbnailImage } from "../../common/app-thumbnail-image";

// Helper to render HTML strings safely
const RawHtml = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

export function ServiceListItem({ services }: { services: CompanyService[] }) {
  const { t } = useTranslation();

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {t("serviceListItems.noServices")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {services.map((service, index) => {
        const isEven = index % 2 === 0;
        const defaultColor = "from-amber-500 to-orange-600";

        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-2 hover:shadow-2xl transition-all duration-300">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
                  isEven ? "" : "lg:grid-flow-row-dense"
                }`}
              >
                {/* Image */}
                <div
                  className={`group relative max-h-[650px] overflow-hidden ${
                    isEven ? "" : "lg:col-start-2"
                  }`}
                >
                  <AppThumbnailImage
                    src={service.imageUrls?.[0]}
                    alt={service.title}
                    className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                </div>

                {/* Content */}
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge
                      className={`mb-4 bg-linear-to-r ${defaultColor} text-white border-0`}
                    >
                      {t("serviceListItems.featuredBadge")}
                    </Badge>
                    <h3 className="mb-4 text-2xl md:text-3xl">
                      {service.title}
                    </h3>
                    {/* Subtitle/Short Description */}
                    <RawHtml
                      html={service.shortDescription || ""}
                      className="text-muted-foreground mb-6 leading-relaxed prose prose-sm max-w-none prose-p:m-0"
                    />

                    {/* Features List */}
                    {service.features && (
                      <div className="mb-6">
                        {Array.isArray(service.features) ? (
                          <ul className="space-y-2">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold mt-1">
                                  ✓
                                </span>
                                <span className="text-muted-foreground">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <RawHtml
                            html={
                              typeof service.features === "string"
                                ? service.features
                                : ""
                            }
                            className="space-y-3 prose prose-sm max-w-none prose-ul:list-none prose-ul:p-0 prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:m-0"
                          />
                        )}
                      </div>
                    )}

                    <AppButton
                      variant="default"
                      label={t("serviceListItems.viewDetails")}
                      to={`/services/${service.id}`}
                    />
                  </motion.div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
