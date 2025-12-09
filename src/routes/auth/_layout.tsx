import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_layout")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
