import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Usando a variável de ambiente para a base URL
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: process.env.REACT_APP_API_USERNAME || "", // Usando a variável de ambiente para o nome de usuário
    password: process.env.REACT_APP_API_PASSWORD || "", // Usando a variável de ambiente para a senha
  },
});

export default api;
