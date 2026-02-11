import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
      throw new Error("useAuth must be used within <AuthProvider>");
    }
  
    const isAdmin = ctx.user?.roles.includes("Admin") ?? false;
    const isModerator = ctx.user?.roles.includes("Moderator") ?? false;
  
    return {
      ...ctx,
      isAdmin,
      isModerator
    };
  }
  
