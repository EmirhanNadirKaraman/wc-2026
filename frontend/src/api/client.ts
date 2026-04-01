import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const client = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});
