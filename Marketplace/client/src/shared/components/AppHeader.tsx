import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useState } from "react";
import { LanguageSwitcher } from "../../i18n/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../../features/hooks/ThemeToggle";

/* =========================================================
   APP HEADER
========================================================= */

export function AppHeader() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
<header
  style={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    boxShadow: "var(--shadow-sm)",
  }}
>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontWeight: 900,
            fontSize: 20,
            color: "var(--text-primary)",
            textDecoration: "none"
          }}
        >
          ◈ Marketplace
        </Link>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language + Theme */}
          <div style={{ color: "var(--text-primary)" }}>
  <LanguageSwitcher compact />
</div>
          <ThemeToggle />

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <NavLinks
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
            />
          </nav>

          {/* Desktop Auth */}
          <div className="desktop-nav" style={{ display: "flex", gap: 8 }}>
            {!isAuthenticated ? (
              <>
                <Link to="/login" style={ghostButton}>
                  {t("common.Login")}
                </Link>
                <Link to="/register" style={primaryButton}>
                  {t("common.Register")}
                </Link>
              </>
            ) : (
              <>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {user?.email}
                </span>
                <button onClick={logout} style={ghostButton}>
                  {t("common.Logout")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="mobile-only"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-primary)",
              fontSize: 18,
              cursor: "pointer"
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="mobile-only"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)"
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
        .desktop-nav { display: flex; gap: 8px; }
        .mobile-only { display: none; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </header>
  );
}

/* =========================================================
   NAV LINKS
========================================================= */

function NavLinks({
  isAuthenticated,
  isAdmin
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}) {
  const { t } = useTranslation();

  const linkStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: "var(--text-primary)",
    fontSize: 14
  };

  return (
    <>
      <Link to="/" style={linkStyle}>
        {t("common.Browse")}
      </Link>

      {isAuthenticated && (
        <>
          <Link to="/me/listings" style={linkStyle}>
            {t("common.MyListings")}
          </Link>
          <Link to="/inbox" style={linkStyle}>
            {t("common.Inbox")}
          </Link>
        </>
      )}

      <Link to="/me/favorites" style={linkStyle}>
        {t("common.Favorites")}
      </Link>

      {isAdmin && (
        <Link
          to="/admin/categories"
          style={{
            ...linkStyle,
            color: "var(--primary)",
            fontWeight: 600
          }}
        >
          Admin
        </Link>
      )}
            {isAdmin && (
        <Link
          to="/admin/listings/pending"
          style={{
            ...linkStyle,
            color: "var(--primary)",
            fontWeight: 600
          }}
        >
          Admin-Pending
        </Link>
      )}
    </>
  );
}

/* =========================================================
   MOBILE MENU
========================================================= */

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

  const mobileLink: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 8,
    textDecoration: "none",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    display: "block"
  };

  return (
    <div style={{ padding: 16, display: "grid", gap: 10 }}>
      {isAuthenticated && (
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {userEmail}
        </div>
      )}

      <Link to="/" onClick={close} style={mobileLink}>
        {t("common.Browse")}
      </Link>

      {isAuthenticated && (
        <>
          <Link to="/me/listings" onClick={close} style={mobileLink}>
            {t("common.MyListings")}
          </Link>
          <Link to="/inbox" onClick={close} style={mobileLink}>
            {t("common.Inbox")}
          </Link>
        </>
      )}

      <Link to="/me/favorites" onClick={close} style={mobileLink}>
        {t("common.Favorites")}
      </Link>

      {isAdmin && (
        <Link
          to="/admin/categories"
          onClick={close}
          style={{ ...mobileLink, color: "var(--primary)" }}
        >
          Admin
        </Link>
      )}

      {!isAuthenticated ? (
        <>
          <Link to="/login" onClick={close} style={mobileLink}>
            {t("common.Login")}
          </Link>
          <Link to="/register" onClick={close} style={primaryButton}>
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
            ...mobileLink,
            cursor: "pointer",
            background: "transparent"
          }}
        >
          {t("common.Logout")}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   BUTTON STYLES
========================================================= */

const ghostButton: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text-primary)",
  textDecoration: "none",
  fontSize: 14,
  cursor: "pointer"
};

const primaryButton: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer"
};
