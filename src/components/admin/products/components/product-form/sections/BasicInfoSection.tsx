import {
  TextInput,
  Select,
  Switch,
  Stack,
  Grid,
  Group,
  Text,
  Card,
} from "@mantine/core";
import { UseFormRegister } from "react-hook-form";
import type { ProductFormData, CategoryItem } from "../hooks/use-product-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  register: UseFormRegister<ProductFormData>;
  watchedPrice: number | null;
  formatPrice: (v: number | null) => string;
  watchedCategoryId: number | null;
  setValue: (name: any, value: any) => void;
  errors: any;
  categories: CategoryItem[];
}

export function BasicInfoSection({
  register,
  watchedPrice,
  formatPrice,
  watchedCategoryId,
  setValue,
  errors,
  categories,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <Stack gap="lg">
      <TextInput
        size="md"
        label={
          <Text size="md" fw={600} c={textColor} component="span">
            {t("productsPage.admin.form.labels.name")}
          </Text>
        }
        placeholder={t("productsPage.admin.form.placeholders.name")}
        withAsterisk
        {...register("name", {
          required: t("productsPage.admin.form.validation.nameRequired"),
        })}
        error={errors.name?.message}
      />

      <Select
        size="md"
        label={
          <Text size="md" fw={600} c={textColor} component="span">
            {t("productsPage.admin.form.labels.category")}
          </Text>
        }
        placeholder={t("productsPage.admin.form.placeholders.category")}
        withAsterisk
        data={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        value={watchedCategoryId ? String(watchedCategoryId) : null}
        onChange={(value) =>
          setValue("categoryId", value ? Number(value) : (null as any))
        }
        error={
          !watchedCategoryId
            ? t("productsPage.admin.form.validation.categoryRequired")
            : undefined
        }
        searchable
        nothingFoundMessage={t("common.noResults", "Không tìm thấy")}
      />

      <Grid align="flex-end">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            size="md"
            label={
              <Text size="md" fw={600} c={textColor} component="span">
                {t("productsPage.admin.form.labels.price")}
              </Text>
            }
            placeholder={t("productsPage.admin.form.placeholders.price")}
            value={watchedPrice === null ? "" : String(watchedPrice)}
            onChange={(e) => {
              const val = e.currentTarget.value.replace(/[^0-9]/g, "");
              setValue("price", val === "" ? null : val);
            }}
            error={errors.price?.message}
            description={
              watchedPrice && Number(watchedPrice) > 0
                ? `≈ ${formatPrice(Number(watchedPrice))} VNĐ`
                : undefined
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 12 }}>
          <Stack gap={4}>
            <Text size="md" fw={600} c={textColor}>
              {t("productsPage.admin.form.labels.summary")}
            </Text>
            <Text size="sm" c="dimmed">
              {t("productsPage.admin.form.labels.summaryHint")}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>

      <Card
        withBorder
        radius="md"
        p="md"
        bg={theme === "dark" ? "dark.8" : "gray.0"}
      >
        <Group grow align="flex-start">
          <Switch
            size="md"
            label={
              <Text size="md" fw={500} c={textColor}>
                {t("productsPage.admin.form.labels.isFeatured")}
              </Text>
            }
            description={t(
              "productsPage.admin.form.labels.isFeaturedHint",
              "Hiển thị trong danh sách tiêu biểu ngoài trang chủ"
            )}
            {...register("isFeatured")}
          />

          <Switch
            size="md"
            label={
              <Text size="md" fw={500} c={textColor}>
                {t("productsPage.admin.form.labels.showPrice")}
              </Text>
            }
            description={t(
              "productsPage.admin.form.labels.showPriceHint",
              "Cho phép người dùng thấy giá sản phẩm công khai"
            )}
            {...register("showPrice")}
            color="green"
          />
        </Group>
      </Card>
    </Stack>
  );
}
