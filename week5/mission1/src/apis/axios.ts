import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청을 보낼 때마다 실행되는 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
