import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";

export const AboutAndResourcesForm = () => {
  const { t } = useTranslation();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  const aboutUsValue = watch("aboutUs");
  const facilitiesIntroValue = watch("facilitiesIntro");
  const profileIntroValue = watch("profileIntro");

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("admin.contactUsManager.form.labels.aboutUs")}
        </label>
        <AppRichTextEditor
          value={aboutUsValue || ""}
          onChange={(value) =>
            setValue("aboutUs", value, { shouldDirty: true })
          }
          placeholder={
            t("admin.contactUsManager.form.placeholders.aboutUs") ||
            "Nhập nội dung giới thiệu..."
          }
        />
        {errors.aboutUs && (
          <p className="text-red-500 text-sm mt-1">{errors.aboutUs.message}</p>
        )}
      </div>

      <AppRichTextEditor
        label={t(
          "admin.contactUsManager.form.labels.facilitiesIntro",
          "Giới thiệu cơ sở vật chất"
        )}
        value={facilitiesIntroValue || ""}
        onChange={(value) =>
          setValue("facilitiesIntro", value, { shouldDirty: true })
        }
        error={errors.facilitiesIntro?.message}
        height="300px"
      />

      <AppRichTextEditor
        label={t(
          "admin.contactUsManager.form.labels.profileIntro",
          "Hồ sơ năng lực"
        )}
        value={profileIntroValue || ""}
        onChange={(value) =>
          setValue("profileIntro", value, { shouldDirty: true })
        }
        error={errors.profileIntro?.message}
        height="300px"
      />
    </>
  );
};
