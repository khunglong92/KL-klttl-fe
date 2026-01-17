import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";
import { ItemListEditor } from "./ItemListEditor";

export const CoreValuesForm = () => {
  const { t } = useTranslation();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  const coreValuesDescriptionValue = watch("coreValuesDescription");
  const coreValuesItemsValue = watch("coreValuesItems");

  return (
    <>
      <div className="mb-4">
        <AppRichTextEditor
          label={t(
            "admin.contactUsManager.form.labels.coreValuesDescription",
            "Mô tả Giá trị cốt lõi"
          )}
          value={coreValuesDescriptionValue || ""}
          onChange={(value) =>
            setValue("coreValuesDescription", value, { shouldDirty: true })
          }
          error={errors.coreValuesDescription?.message}
          height="200px"
        />
      </div>

      <ItemListEditor
        label={t(
          "admin.contactUsManager.form.labels.coreValuesItems",
          "Danh sách Giá trị cốt lõi"
        )}
        value={coreValuesItemsValue || ""}
        onChange={(value) =>
          setValue("coreValuesItems", value, { shouldDirty: true })
        }
        iconOptions={[
          { value: "Target", label: "🎯 Target (Mục tiêu/Chính xác)" },
          { value: "Heart", label: "❤️ Heart (Tận tâm/Đam mê)" },
          { value: "Shield", label: "🛡️ Shield (Uy tín/Bảo vệ)" },
          { value: "Award", label: "🏆 Award (Chất lượng/Thành tựu)" },
          { value: "Star", label: "⭐ Star (Xuất sắc)" },
          { value: "Users", label: "👥 Users (Khách hàng/Con người)" },
          { value: "Handshake", label: "🤝 Handshake (Hợp tác/Tin cậy)" },
          { value: "Lightbulb", label: "💡 Lightbulb (Sáng tạo)" },
          { value: "Clock", label: "⏰ Clock (Đúng hạn)" },
          { value: "CheckCircle", label: "✅ CheckCircle (Cam kết)" },
          { value: "Smile", label: "😊 Smile (Hài lòng)" },
          { value: "ThumbsUp", label: "👍 ThumbsUp (Đánh giá cao)" },
        ]}
        colorOptions={[
          { value: "from-blue-500 to-cyan-500", label: "Xanh dương (Tin cậy)" },
          { value: "from-amber-500 to-orange-600", label: "Cam (Năng động)" },
          { value: "from-red-500 to-pink-600", label: "Đỏ (Nhiệt huyết)" },
          {
            value: "from-green-500 to-emerald-600",
            label: "Xanh lá (Bền vững)",
          },
          { value: "from-purple-500 to-violet-600", label: "Tím (Sáng tạo)" },
          {
            value: "from-indigo-500 to-blue-600",
            label: "Indigo (Chuyên nghiệp)",
          },
          { value: "from-teal-500 to-green-500", label: "Teal (Tươi mới)" },
        ]}
        showColor
      />
    </>
  );
};
