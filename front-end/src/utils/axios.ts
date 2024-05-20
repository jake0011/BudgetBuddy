const axios = require("axios");

const url = "http://localhost:3500";

export default axios.create({
  baseURL: url,
  withCredentials: true,
});
