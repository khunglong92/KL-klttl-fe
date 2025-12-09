import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import LoginPage from "@/page/admin/auth/login"; // Re-using the login page component
import { UserRole } from "@/stores/types";

export const Route = createFileRoute("/auth/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleLoginSuccess = () => {
    // Get the latest user state after login
    const loggedInUser = useAuthStore.getState().user;
    if (loggedInUser?.role === UserRole.ADMIN) {
      navigate({ to: "/admin/dashboard", replace: true });
    } else {
      navigate({ to: "/", replace: true });
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        navigate({ to: "/admin/dashboard", replace: true });
      } else {
        navigate({ to: "/", replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return <LoginPage onLogin={handleLoginSuccess} />;
}
