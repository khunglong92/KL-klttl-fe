import AppModal from "@/components/atoms/app-modal";
import { TextInput, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";

export function CategoryDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  setForm,
  onSubmit,
  isSaving,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: { name: string; description: string };
  setForm: (
    updater: (prev: { name: string; description: string }) => {
      name: string;
      description: string;
    }
  ) => void;
  onSubmit: () => void;
  isSaving?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <AppModal
      opened={isOpen}
      onClose={() => onOpenChange(false)}
      title={
        isEditing ? t("categories.updateTitle") : t("categories.createTitle")
      }
      className="min-w-[400px]! min-h-[400px]!"
      centered
      primaryAction={{
        label: isEditing ? t("categories.update") : t("categories.save"),
        onClick: onSubmit,
        loading: isSaving,
        disabled: !form.name,
      }}
      secondaryAction={{
        label: t("categories.cancel"),
        onClick: () => onOpenChange(false),
        disabled: isSaving,
      }}
    >
      <div className="grid gap-4 py-4">
        <TextInput
          label={t("categories.name")}
          placeholder={t("categories.name")}
          value={form.name}
          onChange={(e) => {
            const value = e.target?.value || "";
            setForm((s) => ({ ...s, name: value }));
          }}
          required
        />
        <Textarea
          label={t("categories.description")}
          placeholder={t("categories.description")}
          rows={4}
          value={form.description}
          onChange={(e) => {
            const value = e.target?.value || "";
            setForm((s) => ({ ...s, description: value }));
          }}
        />
      </div>
    </AppModal>
  );
}
