import { Navigate } from "react-router-dom";
import { useAuth } from "../../../src/auth/useAuth";
import type { JSX } from "react";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!user.roles?.includes("Admin"))
    return <Navigate to="/" replace />;

  return children;
}
