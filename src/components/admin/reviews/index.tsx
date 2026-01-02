import { useState, useEffect } from "react";
import { Table, Badge, ActionIcon, Card, Center } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconTrash,
  IconMessage2,
  IconStar,
  IconFilter,
  IconCalendar,
  IconEye,
  IconArrowLeft,
} from "@tabler/icons-react";
// import { Badge } from "@/components/ui/badge"; // Removed shadcn badge
// import { Button } from "@/components/ui/button"; // Removed shadcn button
import {
  reviewsService,
  Review,
  ReviewTargetType,
} from "@/services/api/reviewsService";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Title, Text, Stack, Group, Pagination, Box } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useTheme } from "@/hooks/useTheme";
import AppButton from "@/components/atoms/app-button";

export function AdminReviewsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ReviewTargetType | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState<"list" | "detail">("list");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [filterType, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewsService.findAll({
        page,
        limit,
        targetType: filterType === "ALL" ? undefined : filterType,
      });
      setReviews(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      toast.error(t("reviewsAdmin.toast.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: <Text fw={700}>{t("reviewsAdmin.deleteModal.title")}</Text>,
      children: (
        <Text size="sm">{t("reviewsAdmin.deleteModal.description")}</Text>
      ),
      centered: true,
      labels: {
        confirm: t("reviewsAdmin.deleteModal.confirm"),
        cancel: t("reviewsAdmin.deleteModal.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await reviewsService.remove(id);
          toast.success(t("reviewsAdmin.toast.deleteSuccess"));
          fetchReviews();
          setMode("list");
        } catch (error) {
          console.error("Failed to delete review", error);
          toast.error(t("reviewsAdmin.toast.deleteError"));
        }
      },
    });
  };

  const handleViewDetail = (review: Review) => {
    setSelectedReview(review);
    setMode("detail");
  };

  const getTargetLabel = (type: ReviewTargetType) => {
    const labels: Record<ReviewTargetType, string> = {
      PRODUCT: t("reviewsAdmin.filter.product"),
      NEWS: t("reviewsAdmin.filter.news"),
      PROJECT: t("reviewsAdmin.filter.project"),
      SERVICE: t("reviewsAdmin.filter.service"),
      RECRUITMENT: t("reviewsAdmin.filter.recruitment"),
      OTHER: t("reviewsAdmin.filter.other"),
    };
    return labels[type] || type;
  };

  const getTargetColor = (type: ReviewTargetType) => {
    const colors: Record<ReviewTargetType, string> = {
      PRODUCT: "blue",
      NEWS: "indigo",
      PROJECT: "orange",
      SERVICE: "grape",
      RECRUITMENT: "teal",
      OTHER: "gray",
    };
    return colors[type] || "gray";
  };

  return (
    <Stack gap="xl" p={{ base: "md", md: "xl" }}>
      <Group justify="space-between" align="flex-end">
        <Stack gap="xs">
          <Title order={1} c={textColor}>
            {mode === "list"
              ? t("reviewsAdmin.title")
              : t("reviewsAdmin.detailTitle")}
          </Title>
          <Text size="lg" c="dimmed">
            {mode === "list"
              ? t("reviewsAdmin.subtitle")
              : t("reviewsAdmin.detailSubtitle", {
                  name: selectedReview?.name,
                })}
          </Text>
        </Stack>
        {mode === "detail" && (
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={() => setMode("list")}
            leftSection={<IconArrowLeft size={16} />}
            label={t("reviewsAdmin.backToList")}
            showArrow={false}
          />
        )}
      </Group>

      {mode === "list" ? (
        <Card withBorder radius="lg" p={0} shadow="sm">
          <Group justify="space-between" p="xl" pb="md">
            <Group gap="md">
              <Title order={3} c={textColor}>
                {t("reviewsAdmin.allReviews")}
              </Title>
              <Badge variant="outline" size="lg">
                {t("reviewsAdmin.total", { count: total })}
              </Badge>
            </Group>

            <Group gap="sm">
              <IconFilter size={16} className="text-muted-foreground" />
              <Select
                value={filterType}
                onValueChange={(v) => {
                  setFilterType(v as any);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] bg-transparent focus-visible:ring-0">
                  <SelectValue
                    placeholder={t("reviewsAdmin.filterPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent
                  className="border border-gray-200 shadow-xl"
                  style={{
                    zIndex: 1001,
                    backgroundColor: theme === "dark" ? "#030712" : "white",
                  }}
                >
                  <SelectItem value="ALL">
                    {t("reviewsAdmin.filter.all")}
                  </SelectItem>
                  <SelectItem value="PRODUCT">
                    {t("reviewsAdmin.filter.product")}
                  </SelectItem>
                  <SelectItem value="NEWS">
                    {t("reviewsAdmin.filter.news")}
                  </SelectItem>
                  <SelectItem value="PROJECT">
                    {t("reviewsAdmin.filter.project")}
                  </SelectItem>
                  <SelectItem value="SERVICE">
                    {t("reviewsAdmin.filter.service")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Group>
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
                  <Table.Th style={{ width: "25%" }} fw={700} pl="xl">
                    {t("reviewsAdmin.table.sender")}
                  </Table.Th>
                  <Table.Th style={{ width: 120 }} fw={700} ta="center">
                    {t("reviewsAdmin.table.rating")}
                  </Table.Th>
                  <Table.Th fw={700} style={{ width: "auto" }}>
                    {t("reviewsAdmin.table.content")}
                  </Table.Th>
                  <Table.Th style={{ width: 150 }} fw={700} ta="center">
                    {t("reviewsAdmin.table.type")}
                  </Table.Th>
                  <Table.Th style={{ width: 150 }} fw={700} ta="center">
                    {t("reviewsAdmin.table.time")}
                  </Table.Th>
                  <Table.Th style={{ width: 120 }} fw={700} ta="center" pr="xl">
                    {t("reviewsAdmin.table.actions")}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Table.Tr key={i}>
                        <Table.Td colSpan={6} className="p-4">
                          <Skeleton className="h-12 w-full rounded-lg" />
                        </Table.Td>
                      </Table.Tr>
                    ))
                ) : (
                  <>
                    {reviews.map((review) => (
                      <Table.Tr
                        key={review.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewDetail(review)}
                      >
                        <Table.Td pl="xl">
                          <Stack gap={2}>
                            <Text fw={700} size="sm">
                              {review.name}
                            </Text>
                            <Text size="xs" c="dimmed" truncate w={200}>
                              {review.email}
                            </Text>
                          </Stack>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Group gap={4} justify="center">
                            <IconStar
                              size={14}
                              className="fill-amber-500 text-amber-500"
                            />
                            <Text fw={700} c="orange.7" size="sm">
                              {review.rating}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" lineClamp={2}>
                            {review.content}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Badge
                            color={getTargetColor(review.targetType)}
                            variant="light"
                          >
                            {getTargetLabel(review.targetType)}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Group gap={6} c="dimmed" justify="center">
                            <IconCalendar size={12} />
                            <Text size="xs">
                              {dayjs(review.createdAt).format("HH:mm DD/MM")}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td ta="center" pr="xl">
                          <Group gap="xs" justify="center">
                            <ActionIcon
                              variant="light"
                              size="lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(review);
                              }}
                            >
                              <IconEye size={20} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              size="lg"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(review.id);
                              }}
                            >
                              <IconTrash size={20} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </>
                )}
              </Table.Tbody>
            </Table>
            {!loading && reviews.length === 0 && (
              <Center py={60}>
                <Stack align="center" gap="xs">
                  <IconMessage2 size={48} className="opacity-10" />
                  <Text c="dimmed">{t("reviewsAdmin.empty.title")}</Text>
                </Stack>
              </Center>
            )}
          </Box>

          {!loading && total > 0 && (
            <Group
              justify="space-between"
              p="xl"
              bg={theme === "dark" ? "dark.8" : "gray.0"}
              style={{
                borderTop: `1px solid ${theme === "dark" ? "#2C2E33" : "#E5E7EB"}`,
              }}
            >
              <Text size="sm" c="dimmed">
                {t("reviewsAdmin.pagination", {
                  count: reviews.length,
                  total: total,
                })}
              </Text>
              <Pagination
                total={Math.ceil(total / limit)}
                value={page}
                onChange={setPage}
                color="indigo"
                radius="md"
                withEdges
              />
            </Group>
          )}
        </Card>
      ) : (
        <div className="rounded-xl border border-muted bg-card/10 backdrop-blur-sm p-6 md:p-10 shadow-sm w-full">
          <Stack gap="xl">
            <Group justify="space-between">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  {t("reviewsAdmin.detail.senderInfo")}
                </Text>
                <Title order={3} c={textColor}>
                  {selectedReview?.name}
                </Title>
                <Text size="sm" c="dimmed">
                  {selectedReview?.email}
                </Text>
              </Stack>
              <Stack align="flex-end" gap={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                  {t("reviewsAdmin.detail.rating")}
                </Text>
                <Group gap={4}>
                  <IconStar
                    size={20}
                    className="fill-amber-500 text-amber-500"
                  />
                  <Title order={2} c="orange.7">
                    {selectedReview?.rating}/5
                  </Title>
                </Group>
              </Stack>
            </Group>

            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                {t("reviewsAdmin.detail.content")}
              </Text>
              <div className="p-6 rounded-xl bg-muted/20 border border-muted">
                <Text size="lg" style={{ lineHeight: 1.8 }}>
                  {selectedReview?.content}
                </Text>
              </div>
            </Stack>

            <Group
              justify="space-between"
              className="border-t border-muted pt-6"
            >
              <Group gap="xl">
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    {t("reviewsAdmin.detail.time")}
                  </Text>
                  <Text fw={600}>
                    {dayjs(selectedReview?.createdAt).format(
                      "HH:mm - DD [Tháng] MM, YYYY"
                    )}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    {t("reviewsAdmin.detail.type")}
                  </Text>
                  <Badge
                    color={getTargetColor(selectedReview!.targetType)}
                    variant="light"
                  >
                    {getTargetLabel(selectedReview!.targetType)}
                  </Badge>
                </Stack>
              </Group>

              <AppButton
                variant="outline-danger"
                label={t("reviewsAdmin.detail.delete")}
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  handleDelete(selectedReview!.id);
                }}
              />
            </Group>
          </Stack>
        </div>
      )}
    </Stack>
  );
}
