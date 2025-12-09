import {
  Card,
  Title,
  Text,
  TextInput,
  Grid,
  Stack,
  Divider,
  Switch,
  Box,
} from "@mantine/core";
import type { UseFormRegister } from "react-hook-form";
import type { ProductFormData } from "../hooks/use-product-form";

interface Props {
  register: UseFormRegister<ProductFormData>;
}

export function TechnicalSpecsSection({ register }: Props) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack p="md">
        <Box>
          <Title order={4}>Thông số kỹ thuật</Title>
          <Text size="sm" c="dimmed">
            Chi tiết kỹ thuật của sản phẩm
          </Text>
        </Box>
        <Stack>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Kích thước (D x R x C)"
                {...register("technicalSpecs.dimensions")}
                placeholder="1200mm x 700mm x 800mm"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Trọng lượng"
                {...register("technicalSpecs.weight")}
                placeholder="25 kg"
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Chất liệu"
                {...register("technicalSpecs.material")}
                placeholder="Inox 304"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Hoàn thiện bề mặt"
                {...register("technicalSpecs.surfaceFinish")}
                placeholder="Đánh bóng BA"
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Tải trọng"
                {...register("technicalSpecs.loadCapacity")}
                placeholder="120 kg"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Loại hàn"
                {...register("technicalSpecs.weldingType")}
                placeholder="Hàn TIG"
              />
            </Grid.Col>
          </Grid>

          <Divider />

          <Switch
            label="Có thể tùy chỉnh"
            description="Sản phẩm có thể điều chỉnh theo yêu cầu khách hàng"
            {...register("technicalSpecs.customizable")}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
