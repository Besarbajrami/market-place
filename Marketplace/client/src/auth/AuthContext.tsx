import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "./authTypes";
import { tokenStorage } from "./tokenStorage";
import { decodeUserFromToken } from "./jwt";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // run once on app start
  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    const { user: decodedUser, isExpired } = decodeUserFromToken(token);

    if (!decodedUser || isExpired) {
      tokenStorage.clearAll();
      setUser(null);
    } else {
      setUser(decodedUser);
    }

    setLoading(false);
  }, []);

  function loginWithTokens(accessToken: string, refreshToken: string) {
    tokenStorage.setAccess(accessToken);
    tokenStorage.setRefresh(refreshToken);

    const { user: decodedUser } = decodeUserFromToken(accessToken);
    setUser(decodedUser ?? null);
  }

  function logout() {
    tokenStorage.clearAll();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    loginWithTokens,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
