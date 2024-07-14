import axios from "axios";

const url = process.env.BACKEND_URL;

export default axios.create({
  baseURL: url,
  withCredentials: true,
});
