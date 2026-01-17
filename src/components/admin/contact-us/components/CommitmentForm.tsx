import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";

export const CommitmentForm = () => {
  const { t } = useTranslation();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  const commitmentIntroValue = watch("commitmentIntro");

  return (
    <>
      <AppRichTextEditor
        label={t(
          "admin.contactUsManager.form.labels.commitmentIntro",
          "Nội dung Cam kết của chúng tôi"
        )}
        value={commitmentIntroValue || ""}
        onChange={(value) =>
          setValue("commitmentIntro", value, { shouldDirty: true })
        }
        error={errors.commitmentIntro?.message}
        height="300px"
      />
    </>
  );
};
