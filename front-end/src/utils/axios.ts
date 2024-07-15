import axios from "axios";
import { secureStore } from "./secureStore";
import { useAuthStore } from "@/stores/auth";
import Toast from "react-native-toast-message";

const url = process.env.BACKEND_URL;

axios.defaults.baseURL = url;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const setUser = useAuthStore.getState().setUser;
    if (error.response && error.response.status === 403) {
      axios.defaults.headers.common["Authorization"] = "";
      axios.defaults.headers.common["userId"] = "";
      setUser(null);
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
    return Promise.reject(error);
  }
);

export default axios;
