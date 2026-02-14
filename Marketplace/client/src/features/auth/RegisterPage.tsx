import { useState } from "react";
import { register } from "../../auth/authApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const [loading, setLoading] = useState(false);

export function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      nav("/login");
  
    } catch (err: any) {
      // If backend returned something
      if (err.response?.data) {
  
        // If backend returns string
        if (typeof err.response.data === "string") {
          setError(err.response.data);
        }
  
        // If backend returns structured error
        else if (err.response.data.error?.message) {
          setError(err.response.data.error.message);
        }
  
        // If backend returns validation errors
        else if (err.response.data.errors) {
          const firstError = Object.values(err.response.data.errors)[0];
          if (Array.isArray(firstError)) {
            setError(firstError[0]);
          }
        }
  
        else {
          setError(t("common.RegistrationFailed"));
        }
  
      } else {
        setError(t("common.NetworkError"));
      }
    } finally {
      setLoading(false);
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

        <button disabled={loading} type="submit" style={{ marginTop: 16 }}>
  {loading ? "..." : t("common.CreateAccount")}
</button>

      </form>
    </div>
  );
}
