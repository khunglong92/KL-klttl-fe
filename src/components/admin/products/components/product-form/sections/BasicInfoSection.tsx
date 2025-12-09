import {
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Switch,
  Stack,
  Grid,
} from "@mantine/core";
import type { UseFormRegister } from "react-hook-form";
import type { ProductFormData, CategoryItem } from "../hooks/use-product-form";

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
  return (
    <Stack p="md">
      <TextInput
        label="Tên sản phẩm"
        placeholder="VD: Bàn thao tác cơ khí Inox 304"
        withAsterisk
        {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
        error={errors.name?.message}
      />

      <Select
        label="Danh mục"
        placeholder="Chọn danh mục"
        withAsterisk
        data={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        value={watchedCategoryId ? String(watchedCategoryId) : null}
        onChange={(value) =>
          setValue("categoryId", value ? Number(value) : (null as any))
        }
        error={!watchedCategoryId ? "Vui lòng chọn danh mục" : undefined}
        searchable
        nothingFoundMessage="Không tìm thấy"
      />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Giá (VNĐ)"
            placeholder="3200000"
            withAsterisk
            hideControls
            value={watchedPrice ?? undefined}
            onChange={(val) =>
              setValue("price", typeof val === "number" ? val : null)
            }
            error={errors.price?.message}
            description={watchedPrice && watchedPrice > 0 ? `≈ ${formatPrice(watchedPrice)} VNĐ` : undefined}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Chính sách bảo hành"
            rows={3}
            placeholder="VD: Bảo hành 12 tháng cho khung và mối hàn"
            {...register("warrantyPolicy")}
          />
        </Grid.Col>
      </Grid>

      <Textarea
        label="Tổng quan sản phẩm"
        rows={4}
        placeholder="Mô tả ngắn gọn về sản phẩm..."
        withAsterisk
        {...register("description.overview", {
          required: "Mô tả tổng quan là bắt buộc",
        })}
        error={errors.description?.overview?.message}
      />

      <Switch
        label="Sản phẩm tiêu biểu"
        description="Hiển thị trong danh sách tiêu biểu ngoài trang chủ"
        {...register("isFeatured")}
      />
    </Stack>
  );
}
