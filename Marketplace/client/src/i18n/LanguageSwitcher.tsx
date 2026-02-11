import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/languages";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid var(--border)"
      }}
    >
      {SUPPORTED_LANGUAGES.map(l => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
