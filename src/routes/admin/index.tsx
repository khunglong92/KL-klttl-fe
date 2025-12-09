import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/stores/types";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    const { user } = useAuthStore.getState() ?? {};

    if (user && user?.role === UserRole.ADMIN) {
      throw redirect({ to: "/admin/dashboard" });
    } else {
      throw redirect({ to: "/", replace: true });
    }
  },
});
