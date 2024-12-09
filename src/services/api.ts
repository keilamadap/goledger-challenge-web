import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: process.env.REACT_APP_API_USERNAME || "",
    password: process.env.REACT_APP_API_PASSWORD || "",
  },
});

// console.log("Base URL:", process.env.REACT_APP_API_BASE_URL);

export default api;
