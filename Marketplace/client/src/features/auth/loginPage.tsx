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

      // ✅ redirect ONLY after successful login
      nav(from, { replace: true });
    } catch {
      setError("Invalid email or password");
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
