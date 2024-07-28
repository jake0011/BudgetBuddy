import { create } from "zustand"; // Importing create function from zustand
import { persist, createJSONStorage } from "zustand/middleware"; // Importing persist and createJSONStorage from zustand middleware
import { secureStore } from "@/utils/secureStore"; // Importing secureStore for secure storage operations

// Define the state and actions for the date store
interface DateState {
  drawerDate: { month: number; year: number }; // State for the drawer date
  tabDate: { month: number; year: number }; // State for the tab date
  setDrawerDate: (month: number, year: number) => void; // Action to set the drawer date
  setTabDate: (month: number, year: number) => void; // Action to set the tab date
}

// Create the date store using zustand
export const useDateStore = create<DateState>()(
  persist(
    (set) => ({
      drawerDate: {
        month: new Date().getMonth(), // Initialize drawer date with the current month
        year: new Date().getFullYear(), // Initialize drawer date with the current year
      },
      tabDate: { month: new Date().getMonth(), year: new Date().getFullYear() }, // Initialize tab date with the current month and year
      setDrawerDate: (month, year) => set({ drawerDate: { month, year } }), // Action to set the drawer date
      setTabDate: (month, year) => set({ tabDate: { month, year } }), // Action to set the tab date
    }),
    {
      name: "date-storage", // Name for the persisted storage
      storage: createJSONStorage(() => secureStore), // Use secureStore for storage
    }
  )
);
