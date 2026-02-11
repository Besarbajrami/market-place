import axios from "axios";
import { tokenStorage } from "../auth/tokenStorage";
import i18n from "../i18n";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = i18n.language;
  config.headers["Accept-Language"] = lang;
  return config;
});
