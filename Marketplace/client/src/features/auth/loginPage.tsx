import { useState } from "react";
import { login } from "../../auth/authApi";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";
import { inputStyle, labelStyle, primaryButton } from "./formStyles";

export function LoginPage() {
  const { loginWithTokens } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const from = (location.state as any)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const tokens = await login(email, password);
      loginWithTokens(tokens.accessToken, tokens.refreshToken);
      nav(from, { replace: true });
    } catch {
      setError(t("common.LoginFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8
            }}
          >
            {t("common.Login")}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {t("common.WelcomeBack")}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 32,
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>{t("common.Email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>{t("common.Password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                color: "var(--primary)",
                marginBottom: 20,
                fontSize: 14
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...primaryButton,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? t("common.Loading") : t("common.Login")}
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "var(--text-secondary)" }}>
              {t("common.NoAccount")}{" "}
            </span>
            <Link
              to="/register"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              {t("common.Register")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
