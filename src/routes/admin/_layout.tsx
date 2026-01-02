import { AdminSidebar } from "@/components/layout/sidebar-manager";
import { useAuthStore } from "@/stores/authStore";
import { Outlet, createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (
    !isAuthenticated ||
    (user?.role !== "ADMIN" && user?.role !== "MANAGER")
  ) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
