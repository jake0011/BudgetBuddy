import { create } from "zustand"; // Importing create function from zustand
import { persist, createJSONStorage } from "zustand/middleware"; // Importing persist and createJSONStorage from zustand middleware
import { secureStore } from "@/utils/secureStore"; // Importing secureStore for secure storage operations
import { UserType } from "@/types/UserType"; // Importing UserType type

// Define the state and actions for the authentication store
interface AuthState {
  user: UserType | null; // State for the user data
  onBoarded: boolean; // State to check if the user has completed onboarding
  setOnBoarded: (onBoarded: boolean) => void; // Action to set the onboarding state
  setUser: (user: UserType) => void; // Action to set the user data
}

// Create the authentication store using zustand
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // Initialize user state as null
      onBoarded: false, // Initialize onboarding state as false
      setUser: (user) => set({ user }), // Action to set the user data
      setOnBoarded: (onBoarded) => set({ onBoarded }), // Action to set the onboarding state
    }),
    {
      name: "auth-storage", // Name for the persisted storage
      storage: createJSONStorage(() => secureStore), // Use secureStore for storage
    }
  )
);
