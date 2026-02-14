import { useState } from "react";
import { register } from "../../auth/authApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      nav("/login");

    } catch (err: any) {
      if (err.response?.data) {
        const data = err.response.data;

        if (Array.isArray(data) && data.length > 0) {
          setError(data[0].description);
        }
        else if (typeof data === "string") {
          setError(data);
        }
        else if (data.error?.message) {
          setError(data.error.message);
        }
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 0
      }}>
        <div style={{
          position: "absolute",
          top: "15%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(78, 205, 196, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 22s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "-10%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(255, 107, 107, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          animation: "float 28s ease-in-out infinite reverse"
        }} />
      </div>

      {/* Register Card */}
      <div style={{
        maxWidth: 460,
        width: "100%",
        position: "relative",
        zIndex: 1,
        animation: "fadeInUp 0.8s ease-out"
      }}>
        {/* Card Header */}
        <div style={{
          textAlign: "center",
          marginBottom: 32
        }}>
          <div style={{
            fontSize: 40,
            marginBottom: 16
          }}>
            ✨
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ffffff 0%, #a8dadc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 12,
            letterSpacing: "-0.02em"
          }}>
            {t("common.Register")}
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 15
          }}>
            Create your account to get started
          </p>
        </div>

        {/* Form Container */}
        <form 
          onSubmit={onSubmit}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 24,
            padding: 40,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
        >
          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 8,
              letterSpacing: "0.01em"
            }}>
              {t("common.Email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(78, 205, 196, 0.5)";
                e.target.style.background = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "0 0 0 4px rgba(78, 205, 196, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 8,
              letterSpacing: "0.01em"
            }}>
              {t("common.Password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(78, 205, 196, 0.5)";
                e.target.style.background = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "0 0 0 4px rgba(78, 205, 196, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
            />
            <div style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.4)",
              marginTop: 6
            }}>
              Must be at least 6 characters
            </div>
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 8,
              letterSpacing: "0.01em"
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(78, 205, 196, 0.5)";
                e.target.style.background = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "0 0 0 4px rgba(78, 205, 196, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "rgba(255, 107, 107, 0.15)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              color: "#ff6b6b",
              fontSize: 14,
              marginBottom: 24,
              animation: "shake 0.5s ease-in-out"
            }}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 24px",
              borderRadius: 14,
              border: "none",
              background: loading 
                ? "rgba(78, 205, 196, 0.5)" 
                : "linear-gradient(135deg, #4ecdc4 0%, #44a29f 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: loading 
                ? "none" 
                : "0 4px 15px rgba(78, 205, 196, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(78, 205, 196, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(78, 205, 196, 0.4)";
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                Creating account...
              </>
            ) : (
              <>
                {t("common.CreateAccount")}
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "28px 0"
          }}>
            <div style={{
              flex: 1,
              height: 1,
              background: "rgba(255, 255, 255, 0.1)"
            }} />
            <span style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: 13,
              fontWeight: 500
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: 1,
              background: "rgba(255, 255, 255, 0.1)"
            }} />
          </div>

          {/* Login Link */}
          <div style={{
            textAlign: "center"
          }}>
            <span style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 14
            }}>
              Already have an account?{" "}
            </span>
            <Link 
              to="/login"
              style={{
                color: "#4ecdc4",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 14,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#78e6dd";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#4ecdc4";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Sign in
            </Link>
          </div>
        </form>

        {/* Back to Home Link */}
        <div style={{
          textAlign: "center",
          marginTop: 24
        }}>
          <Link 
            to="/"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: 14,
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 10px) scale(0.95); }
          75% { transform: translate(15px, 15px) scale(1.02); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.08) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
