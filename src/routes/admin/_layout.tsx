import { AdminSidebar } from "@/components/layout/sidebar-manager";
import { AdminTopbar } from "@/components/layout/admin-topbar";
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
      <AdminSidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
