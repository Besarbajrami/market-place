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
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)"
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
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
            fontSize: 18,
            color: "#111"
          }}
        >
          Marketplace
        </Link>
        <div>
        <LanguageSwitcher />
        </div>
        {/* DESKTOP NAV */}
        <nav className="desktop-nav">
          <NavLinks isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        </nav>

        {/* RIGHT */}
        <div className="desktop-nav" style={{ display: "flex", gap: 12 }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">{t("common.Login")}</Link>
              <Link to="/register">{t("common.Register")}</Link>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13, opacity: 0.7 }}>
                {user?.email}
              </span>
              <button onClick={logout}>{t("common.Logout")}</button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen(o => !o)}
          className="mobile-only"
          style={{
            background: "none",
            border: 0,
            fontSize: 22,
            cursor: "pointer"
          }}
        >
          ☰
        </button>
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

  return (
    <div style={{ display: "flex", gap: 14 }}>
      <Link to="/">Browse</Link>

      {isAuthenticated && (
        
        <>
             {/* <Link
                to="/sell"
                style={{ fontWeight: 600 }}
              >
                Sell
              </Link> */}
          <Link to="/me/listings">{t("common.MyListings")}</Link>
          <Link to="/inbox">{t("common.Inbox")}</Link>
        </>
      )}
          <Link to="/me/favorites">{t("common.Favorites")}</Link>

      {isAdmin && (
        <Link to="/admin/categories" style={{ color: "crimson" }}>
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

  return (
    
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      {isAuthenticated && (
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          Signed in as {userEmail}
        </div>
      )}

      <Link to="/" onClick={close}>Browse</Link>

      {isAuthenticated && (
        <>
        {/* <Link
      to="/sell"
      onClick={close}
      style={{ fontWeight: 600 }}
    >
      Sell
    </Link> */}
          <Link to="/me/listings" onClick={close}>{t("common.MyListings")}</Link>
          <Link to="/inbox" onClick={close}>{t("common.Inbox")}</Link>
        </>
      )}
          <Link to="/me/favorites" onClick={close}>{t("common.Favorites")}</Link>

      {isAdmin && (
        <Link to="/admin/categories" onClick={close}>
          Admin · Categories
        </Link>
      )}

      <hr />

      {!isAuthenticated ? (
        <>
          <Link to="/login" onClick={close}>{t("common.Login")}</Link>
          <Link to="/register" onClick={close}>{t("common.Register")}</Link>
        </>
      ) : (
        <button
          onClick={() => {
            logout();
            close();
          }}
          style={{ textAlign: "left" }}
        >
          {t("common.Logout")}
        </button>
      )}
    </div>
  );
}
