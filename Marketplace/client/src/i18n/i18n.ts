import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import mk from "./locales/mk.json";
import sq from "./locales/sq.json";

import { getStoredLanguage, storeLanguage } from "./languageStorage";

const initialLanguage = getStoredLanguage();

i18n
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: { translation: en },
      mk: { translation: mk },
      sq: { translation: sq }
    }
  });

// 🔥 Persist on change
i18n.on("languageChanged", lang => {
  storeLanguage(lang as any);
});

export default i18n;
