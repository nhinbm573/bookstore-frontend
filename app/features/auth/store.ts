import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SigninAccount } from "./types";

interface AuthState {
  accessToken: string | null;
  account: SigninAccount | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, account: SigninAccount) => void;
  clearAuth: () => void;
  updateAccessToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      account: null,
      isAuthenticated: false,
      setAuth: (accessToken: string, account: SigninAccount) => {
        set({
          accessToken,
          account,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        set({
          accessToken: null,
          account: null,
          isAuthenticated: false,
        });
      },
      updateAccessToken: (accessToken: string) => {
        set({ accessToken });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        account: state.account,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
