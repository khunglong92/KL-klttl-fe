import { Menu, Group, Text, Avatar, rem, UnstyledButton } from "@mantine/core";
import { IconSettings, IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import AppButton from "../atoms/app-button";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { UserRole } from "@/stores/types";

export default function UserSetting() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/", replace: true });
  };

  // Function to get initials from the user's name for the avatar
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      const firstName = names[0];
      const lastName = names[names.length - 1];
      if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
      }
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {!user && (
        <AppButton
          label={t("admin.login.login")}
          size="sm"
          variant={theme === "dark" ? "outline" : "default"}
          to="/auth/login"
        />
      )}

      {user && (
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UnstyledButton>
              <Group>
                <Avatar
                  className="ring-1 ring-amber-50"
                  src={user?.avtUrl}
                  color="blue"
                  radius="xl"
                >
                  {getInitials(user?.name)}
                </Avatar>

                <div className="hidden lg:block flex-1">
                  <Text size="sm" fw={500}>
                    {user.name}
                  </Text>
                  <Text c="dimmed" size="xs">
                    {user.role}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t("userMenu.account")}</Menu.Label>
            {user.role === UserRole.ADMIN && (
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => navigate({ to: "/admin/dashboard" })}
              >
                {t("userMenu.settings")}
              </Menu.Item>
            )}
            <Menu.Item
              color="red"
              leftSection={
                <IconLogout style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={handleLogout}
            >
              {t("userMenu.logout")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}
