import axios from "axios";
import { secureStore } from "./secureStore";

const url = process.env.BACKEND_URL;

axios.defaults.baseURL = url;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      // delete axios.defaults.headers.common["Authorization"];
      // delete axios.defaults.headers.common["userId"];
      // await secureStore.removeItem("auth-storage");
    }
    return Promise.reject(error);
  }
);

export default axios;
