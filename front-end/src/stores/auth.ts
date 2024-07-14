import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStore } from "@/utils/secureStore";
import { UserType } from "@/types/UserType";

interface AuthState {
  user: UserType | null;
  onBoarded: boolean;
  setOnBoarded: (onBoarded: boolean) => void;
  setUser: (user: UserType) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      onBoarded: false,
      setUser: (user) => set({ user }),
      setOnBoarded: (onBoarded) => set({ onBoarded }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStore),
    }
  )
);
