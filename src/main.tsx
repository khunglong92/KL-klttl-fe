import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./styles/globals.css";
import "./lib/i18n/config";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/carousel/styles.css";
import { queryClient } from "./lib/api/queryClient";
import {
  MantineProvider,
  ColorSchemeScript,
  localStorageColorSchemeManager,
  createTheme,
  MantineColorsTuple,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { routeTree } from "./routeTree.gen";
import { ThemeWrapper } from "./components/theme-wrapper";

// Định nghĩa màu chính của ứng dụng với các shade khác nhau
const primaryColor: MantineColorsTuple = [
  "#e6f2ff", // 0 - lightest
  "#bfddff", // 1
  "#99c9ff", // 2
  "#73b4ff", // 3
  "#4d9fff", // 4
  "#268aff", // 5
  "#1e64fa", // 6 - main color
  "#1850c7", // 7
  "#123c94", // 8
  "#0c2861", // 9 - darkest
];

const theme = createTheme({
  colors: {
    primary: primaryColor,
  },
  primaryColor: "primary",
  primaryShade: 6,

  // Cấu hình font
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  // Cấu hình radius
  defaultRadius: "md",

  // Cấu hình shadows
  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  components: {
    Table: {
      styles: {
        table: {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
        thead: {
          backgroundColor:
            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
        },
        th: {
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: "var(--mantine-font-size-xs)",
          color:
            "light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4))",
          padding: "12px 16px",
          borderBottom:
            "2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
        },
        td: {
          padding: "12px 16px",
          borderBottom:
            "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))",
        },
        tr: {
          transition: "background-color 150ms ease",
          "&:hover": {
            backgroundColor:
              "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
          },
        },
      },
    },

    Pagination: {
      styles: {
        control: {
          border:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
          transition: "all 150ms ease",
          "&[dataActive]": {
            backgroundColor: "var(--mantine-color-primary-6)",
            borderColor: "var(--mantine-color-primary-6)",
            color: "white",
            fontWeight: 600,
          },
          "&:hover:not([dataActive])": {
            backgroundColor:
              "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
          },
        },
      },
    },

    Button: {
      styles: {
        root: {
          fontWeight: 500,
          transition: "all 150ms ease",
        },
      },
    },

    Card: {
      styles: {
        root: {
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
          borderColor:
            "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
          transition: "box-shadow 150ms ease, border-color 150ms ease",
        },
      },
    },

    Modal: {
      styles: {
        content: {
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        },
        header: {
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderBottom:
            "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))",
        },
      },
    },

    Input: {
      styles: {
        input: {
          backgroundColor:
            "light-dark(var(--color-input-background), var(--mantine-color-dark-6))",
          borderColor:
            "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          "&:focus": {
            borderColor: "var(--mantine-color-primary-6)",
          },
        },
      },
    },

    Tabs: {
      styles: {
        list: {
          backgroundColor:
            "light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))",
          borderRadius: "var(--mantine-radius-md)",
          padding: "4px",
        },
        tab: {
          fontWeight: 500,
          color:
            "light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4))",
          borderRadius: "var(--mantine-radius-sm)",
          transition: "background-color 150ms ease, color 150ms ease",
          "&:hover": {
            backgroundColor:
              "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))",
          },
          "&[dataActive]": {
            backgroundColor: "var(--mantine-color-primary-6)",
            color: "white",
          },
        },
        panel: {
          paddingTop: "var(--mantine-spacing-md)",
        },
      },
    },
  },
});

const DefaultNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-200">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-6xl font-bold text-foreground mb-2 animate-pulse">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Trang không tồn tại
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: DefaultNotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Khởi tạo theme từ localStorage hoặc mặc định là "light"
const savedTheme =
  (typeof window !== "undefined" && localStorage.getItem("theme")) || "light";

// Đồng bộ class "dark" với document root ngay từ đầu để tránh flash
if (typeof window !== "undefined") {
  const root = document.documentElement;
  if (savedTheme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ColorSchemeScript defaultColorScheme={savedTheme as "light" | "dark"} />
      <MantineProvider
        theme={theme}
        defaultColorScheme={savedTheme as "light" | "dark"}
        colorSchemeManager={localStorageColorSchemeManager({ key: "theme" })}
      >
        <ModalsProvider>
          <Notifications position="top-right" autoClose={3000} />
          <ThemeWrapper router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
