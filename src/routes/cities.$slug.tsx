import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/cities/$slug")({
  component: () => <Outlet />,
});
