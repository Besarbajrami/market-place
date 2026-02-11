import { useState } from "react";
import { register } from "../../auth/authApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await register(email, password);
      nav("/login");
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1>{t("common.Register")}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>{t("common.Email")}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>{t("common.Password")}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%" }} />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={{ marginTop: 16 }} type="submit">
        {t("common.CreateAccount")}
        </button>
      </form>
    </div>
  );
}
