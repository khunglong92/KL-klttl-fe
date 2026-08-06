import { useEffect, useState } from "react";
import { Card, Skeleton, Stack, Switch, Textarea, Slider, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AppButton from "@/components/atoms/app-button";
import { useAiSettings, useUpdateAiSettings } from "@/services/hooks/useAiChat";

function AiSettingsSkeleton() {
  return (
    <Stack gap="md" p="lg">
      <Skeleton height={30} radius="md" />
      <Skeleton height={160} radius="md" />
      <Skeleton height={40} radius="md" />
    </Stack>
  );
}

export default function AiSettingsManager() {
  const { t } = useTranslation();
  const { data, isLoading } = useAiSettings();
  const updateMutation = useUpdateAiSettings();

  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.4);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setSystemPrompt(data.systemPrompt);
      setTemperature(data.temperature);
      setIsEnabled(data.isEnabled);
      setIsDirty(false);
    }
  }, [data]);

  const handleChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    try {
      await updateMutation.mutateAsync({ systemPrompt, temperature, isEnabled });
      toast.success("Cập nhật cấu hình chatbot thành công!");
      setIsDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
    }
  };

  if (isLoading) return <AiSettingsSkeleton />;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="max-w-3xl mx-auto"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold">{t("admin.sidebar.aiSettings")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cấu hình system prompt, độ sáng tạo và bật/tắt trợ lý AI trên trang public.
        </p>
      </div>

      <Stack gap="lg" p="md">
        <Switch
          label="Bật Chatbot trên trang public"
          checked={isEnabled}
          onChange={(e) => handleChange(setIsEnabled)(e.currentTarget.checked)}
        />

        <Textarea
          label="System Prompt"
          description="Hướng dẫn tổng quát cho trợ lý AI"
          value={systemPrompt}
          onChange={(e) => handleChange(setSystemPrompt)(e.currentTarget.value)}
          minRows={8}
          autosize
        />

        <div>
          <Text size="sm" fw={500} mb={4}>
            Độ sáng tạo (temperature): {temperature.toFixed(1)}
          </Text>
          <Slider
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={handleChange(setTemperature)}
            label={(v) => v.toFixed(1)}
            color="blue"
          />
        </div>

        <Group justify="flex-end" mt="md">
          <AppButton
            label="Lưu cấu hình"
            htmlType="submit"
            loading={updateMutation.isPending}
            disabled={!isDirty}
            showArrow={false}
            onClick={handleSubmit}
          />
        </Group>
      </Stack>
    </Card>
  );
}
