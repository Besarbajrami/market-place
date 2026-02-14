import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/languages";

interface Props {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: Props) {
  const { i18n } = useTranslation();

  // Handle cases like "en-US"
  const currentLang = i18n.language.split("-")[0];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6
      }}
    >
      {!compact && (
        <span style={{ fontSize: 14 }}>🌐</span>
      )}

      <select
        value={currentLang}
        onChange={e => i18n.changeLanguage(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text-primary)",
          fontSize: 13,
          cursor: "pointer",
          outline: "none"
        }}
      >
        {SUPPORTED_LANGUAGES.map(l => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
