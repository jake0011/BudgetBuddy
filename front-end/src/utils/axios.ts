import axios from "axios"; // Importing axios library
import { secureStore } from "./secureStore"; // Importing secureStore for secure storage operations
import { useAuthStore } from "@/stores/auth"; // Importing custom hook for authentication store
import Toast from "react-native-toast-message"; // Importing Toast for notifications

const url = process.env.BACKEND_URL; // Get the backend URL from environment variables

axios.defaults.baseURL = url; // Set the base URL for axios
axios.defaults.withCredentials = true; // Allow axios to send cookies with requests

// Immediately-invoked function expression (IIFE) to set the default authorization header
(async () => {
  const token = useAuthStore.getState().user?.token; // Get the token from the auth store
  if (token) {
    axios.defaults.headers.common["Authorization"] = `${token}`; // Set the authorization header
  }
})();

// Axios response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response, // Return the response if successful
  async (error) => {
    const setUser = useAuthStore.getState().setUser; // Get the setUser function from the auth store
    if (error.response && error.response.status === 403) {
      // If the error status is 403 (Forbidden)
      axios.defaults.headers.common["Authorization"] = ""; // Clear the authorization header
      axios.defaults.headers.common["userId"] = ""; // Clear the userId header
      setUser(null); // Clear the user data in the auth store
      Toast.show({
        type: "error",
        text1: "Session expired",
        text2: "Please login again",
        visibilityTime: 3000,
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
      });
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

export default axios; // Export the configured axios instance as default
