import {
  Table,
  Group,
  Pagination,
  Card,
  TextInput,
  Title,
  Text,
  ActionIcon,
  Badge,
  Box,
  Tooltip,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconEdit,
  IconSearch,
  IconTrash,
  IconPhoto,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Project } from "../types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useEffect, useState } from "react";

interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  perPage: number;
}

export function ProjectTable({
  data,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  onPageChange,
  page,
  perPage,
  isLoading,
}: {
  data: ProjectsResponse | undefined;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (s: Project) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  page: number;
  perPage: number;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebouncedValue(localSearch, 400);

  // Sync debounced value to parent
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const textColor = theme === "dark" ? "white" : "black";
  const projects = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Client-side filtering if needed
  const filteredProjects = projects.filter((project) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.shortDescription?.toLowerCase().includes(searchLower)
    );
  });

  const rows = filteredProjects.map((project, index) => {
    const startOrder = (page - 1) * perPage;
    const displayIndex = startOrder + index + 1;
    const imageCount = project.images?.length || 0;

    return (
      <Table.Tr key={project.id}>
        <Table.Td ta="center">
          <Text size="sm" fw={600} c={textColor}>
            {displayIndex}
          </Text>
        </Table.Td>

        <Table.Td>
          <Tooltip label={project.id} withArrow>
            <Text
              size="xs"
              c="dimmed"
              style={{
                maxWidth: 80,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "help",
              }}
            >
              {project.id.slice(0, 8)}...
            </Text>
          </Tooltip>
        </Table.Td>

        <Table.Td fw={600}>
          <Text size="md" c={textColor} lineClamp={2}>
            {project.title}
          </Text>
          {project.shortDescription && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {project.shortDescription}
            </Text>
          )}
        </Table.Td>

        <Table.Td ta="center">
          <Group gap={4} justify="center">
            <IconPhoto size={16} color="gray" />
            <Text size="sm" fw={500} c={textColor}>
              {imageCount}
            </Text>
          </Group>
        </Table.Td>

        <Table.Td>
          {project.isFeatured ? (
            <Badge size="sm" color="orange" variant="filled">
              Featured
            </Badge>
          ) : (
            <Badge size="sm" color="gray" variant="outline">
              Standard
            </Badge>
          )}
        </Table.Td>

        <Table.Td>
          {project.isActive ? (
            <Badge size="sm" color="green" variant="filled">
              Active
            </Badge>
          ) : (
            <Badge size="sm" color="red" variant="outline">
              Inactive
            </Badge>
          )}
        </Table.Td>

        <Table.Td>
          <Group gap="xs" justify="flex-end">
            <ActionIcon
              variant="light"
              size="lg"
              onClick={() => onEdit(project)}
            >
              <IconEdit size={20} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              size="lg"
              color="red"
              onClick={() => onDelete(project.id)}
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card
      withBorder
      radius="lg"
      p={0}
      shadow="sm"
      style={{ position: "relative", minHeight: 400 }}
    >
      <LoadingOverlay visible={!!isLoading} overlayProps={{ blur: 2 }} />

      <Group justify="space-between" p="xl" pb="md">
        <Title order={3} c={textColor}>
          {t("projectsAdmin.listTitle", "Danh sách dự án")}
        </Title>
      </Group>

      <Group px="xl" pb="lg">
        <TextInput
          size="md"
          placeholder={t(
            "projectsAdmin.searchPlaceholder",
            "Tìm kiếm dự án..."
          )}
          leftSection={<IconSearch size={18} />}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
          radius="md"
        />
      </Group>

      <Box style={{ overflowX: "auto" }}>
        <Table
          miw={1000}
          verticalSpacing="md"
          horizontalSpacing="xl"
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr bg={theme === "dark" ? "dark.6" : "gray.1"}>
              <Table.Th ta="center" style={{ width: 60 }} fw={700}>
                STT
              </Table.Th>
              <Table.Th style={{ width: 100 }} fw={700}>
                {t("projectsAdmin.table.columns.id")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("projectsAdmin.table.columns.title")}
              </Table.Th>
              <Table.Th ta="center" fw={700} style={{ width: 80 }}>
                {t("projectsAdmin.table.columns.image")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("projectsAdmin.table.columns.featured")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("projectsAdmin.table.columns.status")}
              </Table.Th>
              <Table.Th ta="right" fw={700}>
                {t("projectsAdmin.table.columns.actions")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="xl" size="lg">
                    {t("projectsAdmin.table.noData")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group
        justify="space-between"
        p="xl"
        bg={theme === "dark" ? "dark.8" : "gray.0"}
      >
        <Text size="md" fw={500} c={textColor}>
          {t("common.total")}: {total} {t("projectsAdmin.items")} •{" "}
          {t("common.page")} {page}/{totalPages}
        </Text>
        <Pagination
          size="md"
          total={totalPages}
          value={page}
          onChange={onPageChange}
          radius="md"
          withEdges
        />
      </Group>
    </Card>
  );
}
