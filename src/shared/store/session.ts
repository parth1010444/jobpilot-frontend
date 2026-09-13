import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/shared/api/types";

type SessionState = {
  accessToken: string | null;
  user: User | null;
  setSession: (accessToken: string, user: User) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (accessToken, user) => set({ accessToken, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "jobpilot.session",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);

export const UNAUTHORIZED_EVENT = "jobpilot:unauthorized";

export function emitUnauthorized() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
}
