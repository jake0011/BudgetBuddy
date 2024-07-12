const axios = require("axios");

const url = "https://budgetbuddy-leza.onrender.com/v1";

export default axios.create({
  baseURL: url,
  withCredentials: true,
});
