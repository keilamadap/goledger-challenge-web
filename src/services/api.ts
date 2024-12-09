import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "http://ec2-54-91-215-149.compute-1.amazonaws.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: process.env.REACT_APP_API_USERNAME || "psAdmin",
    password: process.env.REACT_APP_API_PASSWORD || "goledger",
  },
});

export default api;
