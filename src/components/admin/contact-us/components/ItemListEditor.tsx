import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Card,
  Group,
  Stack,
  ActionIcon,
  Select,
  Text,
} from "@mantine/core";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ItemData {
  icon: string;
  title: string;
  description: string;
  color?: string;
}

interface ItemListEditorProps {
  label: string;
  value: string; // JSON string
  onChange: (value: string) => void;
  iconOptions: { value: string; label: string }[];
  colorOptions?: { value: string; label: string }[];
  showColor?: boolean;
}

export function ItemListEditor({
  label,
  value,
  onChange,
  iconOptions,
  colorOptions,
  showColor = false,
}: ItemListEditorProps) {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItemData>({
    icon: "",
    title: "",
    description: "",
    color: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Parse JSON value to array
  const parseItems = (): ItemData[] => {
    try {
      if (!value) return [];
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const items = parseItems();

  const saveItems = (newItems: ItemData[]) => {
    onChange(JSON.stringify(newItems));
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditItem({
      icon: iconOptions[0]?.value || "",
      title: "",
      description: "",
      color: colorOptions?.[0]?.value || "",
    });
  };

  const handleSaveNew = () => {
    if (!editItem.title.trim()) return;
    const newItems = [...items, editItem];
    saveItems(newItems);
    setIsAdding(false);
    setEditItem({ icon: "", title: "", description: "", color: "" });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const item = items[index];
    if (!item) return;
    setEditItem({
      icon: item.icon || "",
      title: item.title || "",
      description: item.description || "",
      color: item.color || "",
    });
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editItem.title.trim()) return;
    const newItems = [...items];
    newItems[editingIndex] = editItem;
    saveItems(newItems);
    setEditingIndex(null);
    setEditItem({ icon: "", title: "", description: "", color: "" });
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    saveItems(newItems);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setEditItem({ icon: "", title: "", description: "", color: "" });
  };

  const renderItemForm = () => (
    <Card withBorder p="sm" className="bg-gray-50 dark:bg-navy-800">
      <Stack gap="xs">
        <Group grow>
          <Select
            label={t("admin.contactUsManager.form.labels.icon", "Icon")}
            data={iconOptions}
            value={editItem.icon}
            onChange={(v) => setEditItem({ ...editItem, icon: v || "" })}
            searchable
          />
          {showColor && colorOptions && (
            <Select
              label={t("admin.contactUsManager.form.labels.color", "Màu")}
              data={colorOptions}
              value={editItem.color}
              onChange={(v) => setEditItem({ ...editItem, color: v || "" })}
            />
          )}
        </Group>
        <TextInput
          label={t("admin.contactUsManager.form.labels.title", "Tiêu đề")}
          value={editItem.title}
          onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
          placeholder="Nhập tiêu đề..."
        />
        <Textarea
          label={t("admin.contactUsManager.form.labels.description", "Mô tả")}
          value={editItem.description}
          onChange={(e) =>
            setEditItem({ ...editItem, description: e.target.value })
          }
          placeholder="Nhập mô tả..."
          rows={2}
        />
        <Group justify="flex-end" gap="xs">
          <Button
            size="xs"
            variant="light"
            color="gray"
            leftSection={<X size={14} />}
            onClick={handleCancel}
          >
            {t("common.cancel", "Hủy")}
          </Button>
          <Button
            size="xs"
            leftSection={<Check size={14} />}
            onClick={isAdding ? handleSaveNew : handleSaveEdit}
          >
            {t("common.save", "Lưu")}
          </Button>
        </Group>
      </Stack>
    </Card>
  );

  return (
    <div>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm">
          {label}
        </Text>
        <Button
          size="xs"
          variant="light"
          leftSection={<Plus size={14} />}
          onClick={handleAdd}
          disabled={isAdding || editingIndex !== null}
        >
          {t("common.add", "Thêm")}
        </Button>
      </Group>

      <Stack gap="xs">
        {items.map((item, index) => (
          <Card key={index} withBorder p="xs">
            {editingIndex === index ? (
              renderItemForm()
            ) : (
              <Group justify="space-between" wrap="nowrap">
                <div className="flex-1 min-w-0">
                  <Group gap="xs">
                    <Text size="sm" fw={500} className="text-amber-600">
                      [{item.icon}]
                    </Text>
                    <Text size="sm" fw={500}>
                      {item.title}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {item.description}
                  </Text>
                </div>
                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(index)}
                    disabled={isAdding || editingIndex !== null}
                  >
                    <Edit2 size={14} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(index)}
                    disabled={isAdding || editingIndex !== null}
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </Group>
              </Group>
            )}
          </Card>
        ))}

        {isAdding && renderItemForm()}

        {items.length === 0 && !isAdding && (
          <Text size="sm" c="dimmed" ta="center" py="md">
            {t(
              "admin.contactUsManager.form.noItems",
              "Chưa có item nào. Click 'Thêm' để tạo mới."
            )}
          </Text>
        )}
      </Stack>
    </div>
  );
}
