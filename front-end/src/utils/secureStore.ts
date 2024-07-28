import * as SecureStore from "expo-secure-store"; // Importing SecureStore from expo-secure-store

// Define an object to handle secure storage operations
export const secureStore = {
  // Function to get an item from secure storage
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name); // Retrieve the item asynchronously
  },
  // Function to set an item in secure storage
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value); // Store the item asynchronously
  },
  // Function to remove an item from secure storage
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name); // Delete the item asynchronously
  },
};
