import { Box, Title, TypographyStylesProvider } from "@mantine/core";

interface ServiceContentProps {
  content: string | string[];
  imageUrls: string[];
  title: string;
}

export function ServiceContent({ content }: ServiceContentProps) {
  const renderContent = () => {
    if (Array.isArray(content)) {
      return content.map((p) => `<p>${p}</p>`).join("");
    }
    if (typeof content === "string") {
      return content;
    }
    return "";
  };

  const htmlContent = renderContent();

  return (
    <Box>
      <Title order={2} ta="center" mb="xl">
        Chi tiết dịch vụ
      </Title>
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </TypographyStylesProvider>
    </Box>
  );
}
