import { Outlet } from "react-router-dom";
import { AppHeader } from "../../shared/components/AppHeader";

export function AppLayout() {
  return (
    <div>
      <AppHeader />
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
