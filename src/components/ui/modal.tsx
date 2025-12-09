import { ReactNode } from "react";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { Button } from "@/components/ui/button";

export interface AppModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  size?: ModalProps["size"];
  centered?: boolean;
  withCloseButton?: boolean;
  /** Optional footer actions */
  primaryAction?: {
    label: ReactNode;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: ReactNode;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
}

export function AppModal({
  opened,
  onClose,
  title,
  children,
  size = "lg",
  centered = true,
  withCloseButton = true,
  primaryAction,
  secondaryAction,
}: AppModalProps) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      centered={centered}
      size={size}
      withCloseButton={withCloseButton}
      zIndex={1000}
      keepMounted={false}
      overlayProps={{ opacity: 0.5, blur: 1 }}
      styles={{
        content: { borderRadius: 12, border: "1px solid var(--border)" },
        header: { borderBottom: "1px solid var(--border)" },
      }}
    >
      <div className="space-y-4">
        {children}
        {(primaryAction || secondaryAction) && (
          <div className="flex justify-end gap-2 pt-2">
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </MantineModal>
  );
}

export default AppModal;
