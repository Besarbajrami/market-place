import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { router } from "./app/router/router";
import { setupAuthRefresh } from "./api/authRefresh";
import { AuthProvider } from "./auth/AuthContext";
// src/main.tsx
import "./styles/global.css";
import "./styles/forms.css";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import App from "./App";

setupAuthRefresh();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProviders>
  </React.StrictMode>
);
