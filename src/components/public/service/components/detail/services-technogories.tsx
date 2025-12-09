import { Box, Title, Group, Chip } from "@mantine/core";
import { IconCpu } from "@tabler/icons-react";

interface ServiceTechnologiesProps {
  technologies: string | string[];
}

export function ServiceTechnologies({
  technologies,
}: ServiceTechnologiesProps) {
  const techList = (() => {
    if (!technologies) return [];

    if (Array.isArray(technologies)) {
      return technologies.filter((t) => t.trim());
    }

    if (typeof technologies === "string") {
      const isHtmlContent = technologies.includes("<");
      if (isHtmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(technologies, "text/html");
        return Array.from(doc.querySelectorAll("li")).map(
          (li) => li.textContent || ""
        );
      }
      return technologies.split("\n").filter((b) => b.trim());
    }

    return [];
  })();

  if (techList.length === 0) {
    return null;
  }

  return (
    <Box>
      <Title order={2} ta="center" mb="xl">
        Công nghệ sử dụng
      </Title>
      <Group justify="center" gap="sm">
        {techList.map((tech, index) => (
          <Chip
            key={index}
            variant="outline"
            icon={<IconCpu size={16} />}
            defaultChecked
            readOnly
          >
            {tech}
          </Chip>
        ))}
      </Group>
    </Box>
  );
}
