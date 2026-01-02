import { useState, useEffect } from "react";
import {
  Table,
  Badge,
  ActionIcon,
  TextInput,
  Title,
  Text,
  Stack,
  Group,
  Pagination,
  Box,
  Card,
  Avatar,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconSearch,
  IconPencil,
  IconArrowLeft,
  IconTrash,
  IconEye,
  IconUser,
} from "@tabler/icons-react";
// import { Badge } from "@/components/ui/badge"; // Removed shadcn
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Removed shadcn
// import { Input } from "@/components/ui/input"; // Removed shadcn
import { usersService, User, UserRole } from "@/services/api/usersService";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserEditForm } from "./components/user-form";
import AppButton from "@/components/atoms/app-button";
import { toast } from "sonner";
import { modals } from "@mantine/modals";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/hooks/useTheme";
import { useDebouncedValue } from "@/hooks/useDebouncedValue"; // Import debounce hook

export function AdminUsersPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const debouncedSearch = useDebouncedValue(searchQuery, 400); // Debounce search query 400ms

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]); // Fetch on debounced search change

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersService.findAll({
        page,
        limit,
        search: debouncedSearch, // Use debounced value
      });
      setUsers(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "red";
      case UserRole.MANAGER:
        return "blue";
      case UserRole.USER:
        return "green";
      default:
        return "gray";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setMode("edit");
  };

  const handleDelete = (id: number) => {
    if (!isAdmin) return;
    if (id === currentUser?.id) {
      toast.error(t("usersAdmin.toast.deleteSelfError"));
      return;
    }

    modals.openConfirmModal({
      title: <Text fw={700}>{t("usersAdmin.deleteModal.title")}</Text>,
      children: (
        <Text size="sm">{t("usersAdmin.deleteModal.description")}</Text>
      ),
      centered: true,
      labels: {
        confirm: t("usersAdmin.deleteModal.confirm"),
        cancel: t("usersAdmin.deleteModal.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await usersService.remove(id);
          toast.success(t("usersAdmin.toast.deleteSuccess"));
          fetchUsers();
        } catch (error) {
          console.error("Failed to delete user", error);
          toast.error(t("usersAdmin.toast.deleteError"));
        }
      },
    });
  };

  const handleUpdate = async (
    id: number,
    data: { name: string; role: UserRole; dateOfBirth: string; avtUrl: string }
  ) => {
    if (!isAdmin) return;
    await usersService.update(id, data);
    setMode("list");
    fetchUsers();
  };

  return (
    <Stack gap="xl" p={{ base: "md", md: "xl" }}>
      <Group justify="space-between" align="flex-end">
        <Stack gap="xs">
          <Title order={1} c={textColor}>
            {mode === "list"
              ? t("usersAdmin.title")
              : t("usersAdmin.editTitle")}
          </Title>
          <Text size="lg" c="dimmed">
            {mode === "list"
              ? t("usersAdmin.subtitle")
              : t("usersAdmin.editSubtitle", { name: editingUser?.name })}
          </Text>
        </Stack>
        {mode === "edit" && (
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={() => setMode("list")}
            leftSection={<IconArrowLeft size={16} />}
            label={t("usersAdmin.backToList")}
            showArrow={false}
          />
        )}
      </Group>

      {mode === "list" ? (
        <Card withBorder radius="lg" p={0} shadow="sm">
          <Group justify="space-between" p="xl" pb="md">
            <Title order={3} c={textColor}>
              {t("usersAdmin.listTitle")}
            </Title>
            <TextInput
              placeholder={t("usersAdmin.searchPlaceholder")}
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={handleSearchChange}
              radius="md"
              w={300}
            />
          </Group>

          <Box style={{ overflowX: "auto" }}>
            <Table
              miw={800}
              verticalSpacing="md"
              horizontalSpacing="xl"
              highlightOnHover
            >
              <Table.Thead>
                <Table.Tr bg={theme === "dark" ? "dark.6" : "gray.1"}>
                  <Table.Th style={{ width: 80 }} fw={700} ta="center">
                    {t("usersAdmin.table.id")}
                  </Table.Th>
                  <Table.Th fw={700} style={{ width: "30%" }}>
                    {t("usersAdmin.table.user")}
                  </Table.Th>
                  <Table.Th fw={700} style={{ width: "auto" }}>
                    {t("usersAdmin.table.email")}
                  </Table.Th>
                  <Table.Th style={{ width: 150 }} fw={700} ta="center">
                    {t("usersAdmin.table.role")}
                  </Table.Th>
                  <Table.Th style={{ width: 150 }} fw={700} ta="center">
                    {t("usersAdmin.table.joined")}
                  </Table.Th>
                  <Table.Th style={{ width: 120 }} fw={700} ta="center" pr="xl">
                    {t("usersAdmin.table.actions")}
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
                    {users.map((user) => (
                      <Table.Tr
                        key={user.id}
                        className="group border-muted hover:bg-muted/30 transition-all"
                      >
                        <Table.Td ta="center" className="font-mono text-xs">
                          #{user.id}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              src={user.avtUrl}
                              alt={user.name}
                              radius="xl"
                              size="md"
                              color="initials"
                            >
                              {!user.avtUrl && getInitials(user.name)}
                            </Avatar>
                            <Stack gap={0}>
                              <Text size="sm" fw={600} c={textColor}>
                                {user.name}
                              </Text>
                            </Stack>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{user.email}</Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Badge
                            color={getRoleColor(user.role)}
                            variant="light"
                          >
                            {user.role}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Text size="sm" c="dimmed">
                            {dayjs(user.createdAt).format("DD/MM/YYYY")}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="center" pr="xl">
                          <Group gap="xs" justify="center">
                            <ActionIcon
                              variant="light"
                              size="lg"
                              onClick={() => handleEdit(user)}
                              title={
                                isAdmin
                                  ? t("usersAdmin.actions.edit")
                                  : t("usersAdmin.actions.view")
                              }
                            >
                              {isAdmin ? (
                                <IconPencil size={20} />
                              ) : (
                                <IconEye size={20} />
                              )}
                            </ActionIcon>
                            {isAdmin && user.id !== currentUser?.id && (
                              <ActionIcon
                                variant="light"
                                size="lg"
                                color="red"
                                onClick={() => handleDelete(user.id)}
                                title={t("usersAdmin.actions.delete")}
                              >
                                <IconTrash size={20} />
                              </ActionIcon>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </>
                )}
              </Table.Tbody>
            </Table>
            {!loading && users.length === 0 && (
              <Box py={60} ta="center">
                <IconUser size={48} className="opacity-10 mb-4" />
                <IconUser size={48} className="opacity-10 mb-4" />
                <Text c="dimmed">{t("usersAdmin.empty")}</Text>
              </Box>
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
                {t("usersAdmin.pagination", {
                  count: users.length,
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
        <div className="rounded-xl border border-muted bg-card/30 backdrop-blur-sm p-8 shadow-sm">
          {editingUser && (
            <UserEditForm
              user={editingUser}
              onSave={handleUpdate}
              readOnly={!isAdmin}
            />
          )}
        </div>
      )}
    </Stack>
  );
}
