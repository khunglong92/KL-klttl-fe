import { Menu, Avatar, Text, UnstyledButton } from "@mantine/core";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function getInitials(name?: string) {
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length > 1) {
    const first = names[0];
    const last = names[names.length - 1];
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function AdminTopbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-end border-b border-border bg-card px-6">
      <Menu shadow="md" width={240} position="bottom-end">
        <Menu.Target>
          <UnstyledButton className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-navy-50 dark:hover:bg-navy-950/40">
            <Avatar src={user?.avtUrl} color="gray" radius="xl" size={36}>
              {getInitials(user?.name)}
            </Avatar>
            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1.5">
                <Text size="sm" fw={700}>
                  {user?.name}
                </Text>
                <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-navy-600 dark:bg-navy-950/40 dark:text-navy-300">
                  {user?.role}
                </span>
              </div>
              <Text size="xs" c="dimmed">
                {user?.email}
              </Text>
            </div>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{user?.email}</Menu.Label>
          <Menu.Item
            color="red"
            leftSection={<LogOut className="h-4 w-4" />}
            onClick={handleLogout}
          >
            {t("userMenu.logout")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </header>
  );
}
