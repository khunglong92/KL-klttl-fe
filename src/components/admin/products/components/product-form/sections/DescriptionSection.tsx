import {
  Button,
  Text,
  TextInput,
  Card,
  Title,
  Stack,
  Group,
  ActionIcon,
  Box,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { UseFormRegister } from "react-hook-form";
import type { ProductFormData } from "../hooks/use-product-form";

interface DynamicFieldArrayProps {
  title: string;
  description: string;
  fields: { id: string }[];
  register: UseFormRegister<ProductFormData>;
  remove: (index: number) => void;
  append: (value: string) => void;
  placeholder: string;
  namePrefix: `description.${'features' | 'applications' | 'materials'}`;
}

const DynamicFieldArray = ({
  title,
  description,
  fields,
  register,
  remove,
  append,
  placeholder,
  namePrefix,
}: DynamicFieldArrayProps) => {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack p="md">
        <Box>
          <Title order={4}>{title}</Title>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Box>
        <Stack>
          {fields.map((field, index) => (
            <Group key={field.id} grow align="flex-end">
              <TextInput
                label={`${title.slice(0, -1)} ${index + 1}`}
                placeholder={placeholder}
                {...register(`${namePrefix}.${index}` as const)}
              />
              {fields.length > 1 && (
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => remove(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append("")}
            fullWidth
            leftSection={<IconPlus size={16} />}
          >
            Thêm {title.toLowerCase().slice(0, -1)}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

interface Props {
  register: UseFormRegister<ProductFormData>;
  featureFields: { id: string }[];
  appendFeature: (value: string) => void;
  removeFeature: (index: number) => void;
  applicationFields: { id: string }[];
  appendApplication: (value: string) => void;
  removeApplication: (index: number) => void;
  materialFields: { id: string }[];
  appendMaterial: (value: string) => void;
  removeMaterial: (index: number) => void;
}

export function DescriptionSection(props: Props) {
  const { register } = props;
  return (
    <Stack>
      <DynamicFieldArray
        title="Đặc điểm nổi bật"
        description="Các tính năng và đặc điểm của sản phẩm"
        fields={props.featureFields}
        register={register}
        remove={props.removeFeature}
        append={props.appendFeature}
        placeholder="VD: Khung bàn làm từ thép không gỉ Inox 304"
        namePrefix="description.features"
      />
      <DynamicFieldArray
        title="Ứng dụng"
        description="Các lĩnh vực và mục đích sử dụng"
        fields={props.applicationFields}
        register={register}
        remove={props.removeApplication}
        append={props.appendApplication}
        placeholder="VD: Dùng trong xưởng cơ khí, phòng assembly"
        namePrefix="description.applications"
      />
      <DynamicFieldArray
        title="Vật liệu"
        description="Các vật liệu chính sử dụng trong sản phẩm"
        fields={props.materialFields}
        register={register}
        remove={props.removeMaterial}
        append={props.appendMaterial}
        placeholder="VD: Khung: Inox 304"
        namePrefix="description.materials"
      />
    </Stack>
  );
}
