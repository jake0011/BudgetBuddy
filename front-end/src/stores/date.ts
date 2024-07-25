import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStore } from "@/utils/secureStore";

interface DateState {
  drawerDate: { month: number; year: number };
  tabDate: { month: number; year: number };
  setDrawerDate: (month: number, year: number) => void;
  setTabDate: (month: number, year: number) => void;
}

export const useDateStore = create<DateState>()(
  persist(
    (set) => ({
      drawerDate: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      tabDate: { month: new Date().getMonth(), year: new Date().getFullYear() },
      setDrawerDate: (month, year) => set({ drawerDate: { month, year } }),
      setTabDate: (month, year) => set({ tabDate: { month, year } }),
    }),
    {
      name: "date-storage",
      storage: createJSONStorage(() => secureStore),
    }
  )
);
