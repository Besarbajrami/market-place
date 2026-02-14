import { useState } from "react";
import { register } from "../../auth/authApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function RegisterPage() {
  const nav = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ✅ MOVED HERE

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password);
      nav("/login");

    } 
    catch (err: any) {
      if (err.response?.data) {
    
        const data = err.response.data;
    
        // ✅ CASE 1: backend returns array of Identity errors
        if (Array.isArray(data) && data.length > 0) {
          setError(data[0].description);
        }
    
        // ✅ CASE 2: plain string
        else if (typeof data === "string") {
          setError(data);
        }
    
        // ✅ CASE 3: structured { error: { message } }
        else if (data.error?.message) {
          setError(data.error.message);
        }
    
        // ✅ CASE 4: validation errors { errors: { field: [] } }
        else if (data.errors) {
          const firstError = Object.values(data.errors)[0];
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
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1>{t("common.Register")}</h1>

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

        <button disabled={loading} type="submit" style={{ marginTop: 16 }}>
          {loading ? "..." : t("common.CreateAccount")}
        </button>
      </form>
    </div>
  );
}
