import { useTranslation } from "react-i18next";

interface Props {
  compact?: boolean;
}

export function LanguageSwitcher({ compact }: Props) {
  const { i18n } = useTranslation();

  return (
    <button
      onClick={() =>
        i18n.changeLanguage(
          i18n.language === "en" ? "mk" : "en"
        )
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text-primary)",
        cursor: "pointer"
      }}
    >
      🌐
      {!compact && (
        <span style={{ fontSize: 13 }}>
          {i18n.language.toUpperCase()}
        </span>
      )}
    </button>
  );
}
