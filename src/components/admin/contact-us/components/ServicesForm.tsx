import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";
import { ItemListEditor } from "./ItemListEditor";

export const ServicesForm = () => {
  const { t } = useTranslation();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  const servicesDescriptionValue = watch("servicesDescription");
  const servicesItemsValue = watch("servicesItems");

  return (
    <>
      <div className="mb-4 mt-6">
        <AppRichTextEditor
          label={t(
            "admin.contactUsManager.form.labels.servicesDescription",
            "Mô tả Lĩnh vực ứng dụng"
          )}
          value={servicesDescriptionValue || ""}
          onChange={(value) =>
            setValue("servicesDescription", value, { shouldDirty: true })
          }
          error={errors.servicesDescription?.message}
          height="200px"
        />
      </div>

      <ItemListEditor
        label={t(
          "admin.contactUsManager.form.labels.servicesItems",
          "Danh sách Lĩnh vực ứng dụng"
        )}
        value={servicesItemsValue || ""}
        onChange={(value) =>
          setValue("servicesItems", value, { shouldDirty: true })
        }
        iconOptions={[
          { value: "Settings", label: "⚙️ Settings (Cơ khí/Kỹ thuật)" },
          { value: "Zap", label: "⚡ Zap (Điện/Năng lượng)" },
          { value: "Building2", label: "🏗️ Building2 (Xây dựng/Toà nhà)" },
          { value: "Sofa", label: "🛋️ Sofa (Nội thất)" },
          { value: "Factory", label: "🏭 Factory (Công nghiệp/Nhà máy)" },
          { value: "Truck", label: "🚚 Truck (Vận tải/Logistics)" },
          { value: "Wrench", label: "🔧 Wrench (Sửa chữa/Bảo trì)" },
          { value: "Hammer", label: "🔨 Hammer (Thi công)" },
          { value: "Paintbrush", label: "🖌️ Paintbrush (Hoàn thiện/Decor)" },
          { value: "Ruler", label: "📏 Ruler (Thiết kế/Đo đạc)" },
          { value: "HardHat", label: "👷 HardHat (An toàn/Công trình)" },
          { value: "Home", label: "🏠 Home (Nhà ở)" },
          { value: "Warehouse", label: "🏢 Warehouse (Kho bãi)" },
          { value: "Cog", label: "⚙️ Cog (Máy móc)" },
          { value: "Cpu", label: "💻 Cpu (Công nghệ/Tự động hoá)" },
        ]}
      />
    </>
  );
};
