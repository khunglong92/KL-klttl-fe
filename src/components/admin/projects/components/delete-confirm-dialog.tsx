import { FC } from "react";
import { Modal, Text, Group, Button, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface DeleteConfirmDialogProps {
  type: "category" | "project";
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  type,
  name,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const typeLabel =
    type === "category"
      ? t("projectsAdmin.categories.title", { defaultValue: "Danh mục dự án" })
      : t("projectsAdmin.headerTitle", { defaultValue: "Dự án" });

  return (
    <Modal
      opened={true}
      onClose={onCancel}
      title={t("projectsAdmin.deleteDialog.title", { defaultValue: "Xác nhận xoá" })}
      centered
      overlayProps={{ opacity: 0.2, blur: 2 }}
    >
      <Stack gap="md">
        <Text>
          {t("projectsAdmin.deleteDialog.message", {
            defaultValue: "Bạn có chắc chắn muốn xoá {{typeLabel}} \"{{name}}\"? Hành động này không thể hoàn tác.",
            typeLabel,
            name,
          })}
        </Text>

        <Group justify="flex-end" gap="md" mt="md">
          <Button variant="default" onClick={onCancel}>
            {t("projectsAdmin.deleteDialog.cancel", { defaultValue: "Huỷ" })}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {t("projectsAdmin.deleteDialog.confirm", { defaultValue: "Xoá" })}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteConfirmDialog;
