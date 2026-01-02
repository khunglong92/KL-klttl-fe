import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/services/api/base";
import { AuthState, User } from "./types";

// Zustand store with localStorage persistence. Only minimal state is persisted.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: async (token: string, refreshToken?: string | null) => {
        // Lưu token và refreshToken vào localStorage trước
        set({
          token,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
        });
        // Sau khi lưu token, gọi API profile để lấy thông tin user
        try {
          const profile = await apiClient.get<User>("/users/profile");

          set({
            user: profile,
            isAuthenticated: true,
          });
        } catch (error) {
          // Nếu gọi profile thất bại, vẫn giữ token nhưng không có user info
          // Có thể log error hoặc xử lý theo nhu cầu
          console.error("❌ [AuthStore] Failed to fetch user profile:", error);
          // Vẫn giữ isAuthenticated = true vì đã có token
        }
      },
      updateUser: (user: User | null) => set({ user }),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Convenience selectors to prevent unnecessary re-renders.
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectToken = (s: AuthState) => s.token;
export const selectUser = (s: AuthState) => s.user;
