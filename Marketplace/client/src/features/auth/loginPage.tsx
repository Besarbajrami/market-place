import { useState } from "react";
import { login } from "../../auth/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { loginWithTokens } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const from = (location.state as any)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
  
    try {
      const tokens = await login(email, password);
      loginWithTokens(tokens.accessToken, tokens.refreshToken);
      nav(from, { replace: true });
  
    } catch (err: any) {
      // ✅ If backend returns structured error
      if (err.response?.data) {
  
        // If backend sends: { message: "Invalid credentials" }
        if (typeof err.response.data === "string") {
          setError(err.response.data);
        }
  
        // If backend sends: { error: { message: "..." } }
        else if (err.response.data.error?.message) {
          setError(err.response.data.error.message);
        }
  
        // If backend sends validation errors
        else if (err.response.data.errors) {
          const firstError = Object.values(err.response.data.errors)[0];
          if (Array.isArray(firstError)) {
            setError(firstError[0]);
          }
        }
  
        else {
          setError("Login failed");
        }
  
      } else {
        setError("Network error");
      }
    }
  }
  

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1>{t("common.Login")}</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>{t("common.Email")}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>{t("common.Password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={{ marginTop: 16 }} type="submit">
        {t("common.Login")}
        </button>
      </form>
    </div>
  );
}
