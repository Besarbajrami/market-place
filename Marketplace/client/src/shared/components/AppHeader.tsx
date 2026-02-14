import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useState } from "react";
import { LanguageSwitcher } from "../../i18n/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function AppHeader() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(15, 15, 26, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)"
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontWeight: 900,
            fontSize: 22,
            background: "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            textDecoration: "none",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: 24 }}>◈</span>
          Marketplace
        </Link>

        {/* LANGUAGE SWITCHER */}
        <div style={{ marginLeft: 16 }}>
          <LanguageSwitcher />
        </div>

        {/* DESKTOP NAV */}
        <nav className="desktop-nav" style={{ marginLeft: "auto", marginRight: 24 }}>
          <NavLinks isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        </nav>

        {/* RIGHT - AUTH SECTION */}
        <div className="desktop-nav" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login"
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {t("common.Login")}
              </Link>
              <Link 
                to="/register"
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.3)";
                }}
              >
                {t("common.Register")}
              </Link>
            </>
          ) : (
            <>
              <div style={{
                padding: "8px 16px",
                borderRadius: 10,
                background: "rgba(78, 205, 196, 0.15)",
                border: "1px solid rgba(78, 205, 196, 0.3)",
                fontSize: 13,
                color: "#4ecdc4",
                fontWeight: 500
              }}>
                {user?.email}
              </div>
              <button 
                onClick={logout}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 107, 107, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                {t("common.Logout")}
              </button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen(o => !o)}
          className="mobile-only"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 20,
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="mobile-only"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            animation: "slideDown 0.3s ease-out"
          }}
        >
          <MobileMenu
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            logout={logout}
            userEmail={user?.email}
            close={() => setOpen(false)}
          />
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}

/* ---------------------------------- */
/* NAV LINKS                          */
/* ---------------------------------- */

function NavLinks({
  isAuthenticated,
  isAdmin
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}) {
  const { t } = useTranslation();

  const linkStyle: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    padding: "10px 16px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 500,
    transition: "all 0.3s ease",
    position: "relative"
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link 
        to="/" 
        style={linkStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
        }}
      >
        Browse
      </Link>

      {isAuthenticated && (
        <>
          <Link 
            to="/me/listings" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
            }}
          >
            {t("common.MyListings")}
          </Link>
          <Link 
            to="/inbox" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
            }}
          >
            {t("common.Inbox")}
          </Link>
        </>
      )}

      <Link 
        to="/me/favorites" 
        style={linkStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
        }}
      >
        {t("common.Favorites")}
      </Link>

      {isAdmin && (
        <Link 
          to="/admin/categories" 
          style={{
            ...linkStyle,
            background: "rgba(255, 107, 107, 0.2)",
            color: "#ff6b6b",
            fontWeight: 600
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.3)";
            e.currentTarget.style.color = "#ff8787";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.2)";
            e.currentTarget.style.color = "#ff6b6b";
          }}
        >
          Admin
        </Link>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* MOBILE MENU                        */
/* ---------------------------------- */

function MobileMenu({
  isAuthenticated,
  isAdmin,
  logout,
  userEmail,
  close
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
  userEmail?: string;
  close: () => void;
}) {
  const { t } = useTranslation();

  const mobileLinkStyle: React.CSSProperties = {
    padding: "14px 20px",
    borderRadius: 12,
    color: "#fff",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500,
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    display: "block"
  };

  return (
    <div style={{ 
      padding: 20, 
      display: "grid", 
      gap: 12,
      background: "linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)"
    }}>
      {isAuthenticated && (
        <div style={{ 
          fontSize: 13, 
          color: "rgba(255, 255, 255, 0.5)",
          padding: "8px 12px",
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: 8,
          marginBottom: 8
        }}>
          Signed in as <strong style={{ color: "#4ecdc4" }}>{userEmail}</strong>
        </div>
      )}

      <Link 
        to="/" 
        onClick={close}
        style={mobileLinkStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        }}
      >
        Browse
      </Link>

      {isAuthenticated && (
        <>
          <Link 
            to="/me/listings" 
            onClick={close}
            style={mobileLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            {t("common.MyListings")}
          </Link>
          <Link 
            to="/inbox" 
            onClick={close}
            style={mobileLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            {t("common.Inbox")}
          </Link>
        </>
      )}

      <Link 
        to="/me/favorites" 
        onClick={close}
        style={mobileLinkStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        }}
      >
        {t("common.Favorites")}
      </Link>

      {isAdmin && (
        <Link 
          to="/admin/categories" 
          onClick={close}
          style={{
            ...mobileLinkStyle,
            background: "rgba(255, 107, 107, 0.15)",
            borderColor: "rgba(255, 107, 107, 0.3)",
            color: "#ff6b6b",
            fontWeight: 600
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.15)";
          }}
        >
          Admin · Categories
        </Link>
      )}

      <hr style={{ 
        border: "none", 
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        margin: "12px 0"
      }} />

      {!isAuthenticated ? (
        <>
          <Link 
            to="/login" 
            onClick={close}
            style={{
              ...mobileLinkStyle,
              background: "rgba(255, 255, 255, 0.08)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            {t("common.Login")}
          </Link>
          <Link 
            to="/register" 
            onClick={close}
            style={{
              ...mobileLinkStyle,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
              border: "none",
              fontWeight: 700,
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.3)";
            }}
          >
            {t("common.Register")}
          </Link>
        </>
      ) : (
        <button
          onClick={() => {
            logout();
            close();
          }}
          style={{
            ...mobileLinkStyle,
            textAlign: "left",
            cursor: "pointer",
            background: "rgba(255, 107, 107, 0.1)",
            borderColor: "rgba(255, 107, 107, 0.3)",
            color: "#ff6b6b"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)";
          }}
        >
          {t("common.Logout")}
        </button>
      )}
    </div>
  );
}
