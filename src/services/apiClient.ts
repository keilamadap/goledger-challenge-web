import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://ec2-54-91-215-149.compute-1.amazonaws.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: "psAdmin",
    password: "goledger",
  },
});

export default apiClient;
