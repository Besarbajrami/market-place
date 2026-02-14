import { useState } from "react";
import { register } from "../../auth/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { inputStyle, labelStyle, primaryButton } from "./formStyles";

export function RegisterPage() {
  const nav = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // if (password !== confirmPassword) {
    //   setError(t("common.PasswordsDoNotMatch"));
    //   return;
    // }

    setLoading(true);

    try {
      await register(email, password);
      nav("/login");
    } catch {
      setError(t("common.RegistrationFailed"));
    } finally {
      setLoading(false);
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
            {t("common.Register")}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {t("common.CreateAccount")}
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
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t("common.Email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t("common.Password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              {t("common.ConfirmPassword")}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div> */}

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
            disabled={loading}
            style={{
              ...primaryButton,
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading
              ? t("common.Loading")
              : t("common.CreateAccount")}
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "var(--text-secondary)" }}>
              {t("common.HaveAccount")}{" "}
            </span>
            <Link
              to="/login"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              {t("common.Login")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
