import { AdminSidebar } from "@/components/layout/sidebar-manager";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout")({
  component: AdminLayout,
});

function AdminLayout() {
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
