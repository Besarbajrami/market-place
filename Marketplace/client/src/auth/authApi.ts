import { http } from "../api/http";

export type LoginResponse = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
};

export async function login(email: string, password: string) {
  const { data } = await http.post<LoginResponse>("/api/auth/login", { email, password });
  return data;
}

export async function register(email: string, password: string) {
  await http.post("/api/auth/register", { email, password });
}

export async function refresh(refreshToken: string) {
  const { data } = await http.post<LoginResponse>("/api/auth/refresh", { refreshToken });
  return data;
}
