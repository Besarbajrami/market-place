import { jwtDecode } from "jwt-decode";
import type { AuthRole, AuthUser } from "./authTypes";

type JwtPayload = {
  sub?: string;
  email?: string;
  exp?: number;

  // standard ASP.NET Identity role claim
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
};

export function decodeUserFromToken(
  token: string
): { user: AuthUser | null; isExpired: boolean } {
  try {
    const payload = jwtDecode<JwtPayload>(token);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const exp = payload.exp ?? 0;
    const isExpired = exp !== 0 && exp < nowSeconds;

    if (!payload.sub || !payload.email) {
      return { user: null, isExpired };
    }

    const rawRoles =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const rolesArray: string[] =
      typeof rawRoles === "string"
        ? [rawRoles]
        : Array.isArray(rawRoles)
        ? rawRoles
        : [];

    const roles: AuthRole[] = rolesArray.filter(
      (r): r is AuthRole =>
        r === "User" || r === "Admin" || r === "Moderator"
    );

    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      roles
    };

    return { user, isExpired };
  } catch {
    return { user: null, isExpired: true };
  }
}
