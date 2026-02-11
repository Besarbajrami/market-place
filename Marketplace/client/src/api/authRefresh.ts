import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../auth/tokenStorage";
import { refresh } from "../auth/authApi";
import { http } from "./http";

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

export function setupAuthRefresh() {
  http.interceptors.response.use(
    (resp) => resp,
    async (error: AxiosError) => {
      const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (!original) throw error;

      // Only handle 401 once per request
      if (error.response?.status !== 401 || original._retry) {
        throw error;
      }

      original._retry = true;

      const currentRefresh = tokenStorage.getRefresh();
      if (!currentRefresh) {
        tokenStorage.clearAll();
        throw error;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (!token) return reject(error);
            original.headers.Authorization = `Bearer ${token}`;
            resolve(http(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const tokens = await refresh(currentRefresh);

        tokenStorage.setAccess(tokens.accessToken);
        tokenStorage.setRefresh(tokens.refreshToken);

        processQueue(tokens.accessToken);

        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return http(original);
      } catch (e) {
        processQueue(null);
        tokenStorage.clearAll();
        throw e;
      } finally {
        isRefreshing = false;
      }
    }
  );
}
