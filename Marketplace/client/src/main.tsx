import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { router } from "./app/router/router";
import { setupAuthRefresh } from "./api/authRefresh";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./features/hooks/ThemeContext"; // ✅ ADD THIS
import "./styles/global.css";
import "./styles/forms.css";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import "./global-adaptive.css";  // Make sure this points to the right file
import "./header-adaptive.css";  // Make sure this exists
setupAuthRefresh();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider> {/* ✅ ADD THIS - Wrap everything */}
      <AppProviders>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AppProviders>
    </ThemeProvider> {/* ✅ ADD THIS */}
  </React.StrictMode>
);
