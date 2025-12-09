import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { QuoteForm } from "./components/quote-form";
import { QuoteInfo } from "./components/quote-info";
import { AppThumbnailImage } from "../common/app-thumbnail-image";
import { useTranslation } from "react-i18next";
import { Grid, Container } from "@mantine/core";
import {
  IconFileText,
  IconChecklist,
  IconClock,
  IconHeadset,
} from "@tabler/icons-react";

export default function QuotePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: IconFileText,
      title: t("quotePage.features.quick.title"),
      description: t("quotePage.features.quick.description"),
    },
    {
      icon: IconChecklist,
      title: t("quotePage.features.detailed.title"),
      description: t("quotePage.features.detailed.description"),
    },
    {
      icon: IconClock,
      title: t("quotePage.features.fast.title"),
      description: t("quotePage.features.fast.description"),
    },
    {
      icon: IconHeadset,
      title: t("quotePage.features.support.title"),
      description: t("quotePage.features.support.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <AppThumbnailImage
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHF1b3RlfGVufDF8fHx8MTc2MjE3OTgxMXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Quote Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-white">
              {t("quotePage.hero.badge")}
            </Badge>
            <h1 className="text-white mb-6 text-3xl md:text-4xl lg:text-5xl font-bold">
              {t("quotePage.hero.title")}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {t("quotePage.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("quotePage.features.title")}
            </h2>
            <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("quotePage.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="bg-card rounded-2xl p-6 text-center border-2 border-border hover:border-amber-500/50 transition-all"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex p-4 rounded-full bg-amber-500/10 mb-4"
                  >
                    <Icon className="h-8 w-8 text-amber-500" />
                  </motion.div>
                  <h3 className="mb-3 font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Main Form Section */}
      <section className="py-16 md:py-24">
        <Container size="xl">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <QuoteForm />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <QuoteInfo />
            </Grid.Col>
          </Grid>
        </Container>
      </section>
    </div>
  );
}

