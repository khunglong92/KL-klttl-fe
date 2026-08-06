import {
  createRootRoute,
  Outlet,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/stores/types";
import { useEffect } from "react";
import { ScrollToTop } from "@/components/atoms/scroll-to-top";
import { LocationMap } from "@/components/public/home/location-map";
import { FloatingContactButtons } from "@/components/public/common/floating-contact-buttons";
import { AiChatWidget } from "@/components/public/common/ai-chat-widget";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore.getState();
  const isAdmin = user?.role === UserRole.ADMIN;

  const navigate = useNavigate();
  const routerState = useRouterState(); // lấy trạng thái router
  const pathname = routerState.location.pathname;

  useEffect(() => {
    // Nếu là đường dẫn admin nhưng user không phải admin => quay lại "/"
    if (pathname.startsWith("/admin") && !isAdmin) {
      navigate({ to: "/", replace: true });
    }
  }, [pathname, isAdmin, navigate]);

  return (
    <>
      {/* Chỉ hiển thị Header công cộng nếu không phải là trang admin */}
      {!pathname.startsWith("/admin") && (
        <Header theme={theme} toggleTheme={toggleTheme} />
      )}

      <main className="min-h-screen">
        <ScrollToTop />
        <Outlet />
      </main>
      {!pathname.startsWith("/admin") && <LocationMap />}
      {!pathname.startsWith("/admin") && <AiChatWidget />}
      
      {/* Chỉ hiển thị Footer công cộng nếu không phải là trang admin */}
      {!pathname.startsWith("/admin") && <Footer />}

      {/* Ẩn FloatingContactButtons nếu là admin */}
      {!pathname.startsWith("/admin") && <FloatingContactButtons />}

      {/* {import.meta.env.DEV && <TanStackRouterDevtools />} */}
    </>
  );
}
