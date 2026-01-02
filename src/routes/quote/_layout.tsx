import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quote/_layout")({
  component: () => <Outlet />,
});
