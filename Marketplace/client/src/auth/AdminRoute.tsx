import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
