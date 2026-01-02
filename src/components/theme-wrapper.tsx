import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { RouterProvider } from "@tanstack/react-router";

interface ThemeWrapperProps {
  router: any;
}

export function ThemeWrapper({ router }: ThemeWrapperProps) {
  const { theme } = useTheme();

  // Đồng bộ theme với CSS variables và Tailwind
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  return <RouterProvider router={router} />;
}
