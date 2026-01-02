import { Modal, Group, type ModalProps } from "@mantine/core";
import React from "react";
import AppButton from "./app-button"; // Import AppButton
import { XIcon } from "lucide-react";

// Định nghĩa props cho các nút hành động
interface ModalAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Mở rộng ModalProps của Mantine và thêm các props tùy chỉnh
interface AppModalProps
  extends Omit<ModalProps, "opened" | "onClose" | "title"> {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
}

export default function AppModal({
  opened,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  ...rest
}: AppModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered {...rest}>
      {children}

      <div className="flex justify-center items-center gap-x-8">
        {(primaryAction || secondaryAction) && (
          <Group justify="flex-end" mt="md">
            {secondaryAction && (
              <AppButton
                size="sm"
                label={secondaryAction.label}
                variant="outline-primary" // Sử dụng variant outline cho nút phụ
                onClick={secondaryAction.onClick}
                disabled={primaryAction?.loading || secondaryAction.disabled}
                showArrow={false}
                leftSection={<XIcon size="14" />}
              />
            )}
            {primaryAction && (
              <AppButton
                size="sm"
                variant="default" // Sử dụng variant default cho nút chính
                label={primaryAction.label}
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
                disabled={primaryAction.disabled || primaryAction.loading}
              />
            )}
          </Group>
        )}
      </div>
    </Modal>
  );
}
