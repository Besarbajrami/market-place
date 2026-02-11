import {
    DEFAULT_LANGUAGE,
    LANGUAGE_STORAGE_KEY,
    SUPPORTED_LANGUAGES,
    type AppLanguage
  } from "./languages";
  
  export function getStoredLanguage(): AppLanguage {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored as AppLanguage)) {
      return stored as AppLanguage;
    }
  
    // fallback to browser
    const browser = navigator.language.split("-")[0];
    if (SUPPORTED_LANGUAGES.includes(browser as AppLanguage)) {
      return browser as AppLanguage;
    }
  
    return DEFAULT_LANGUAGE;
  }
  
  export function storeLanguage(lang: AppLanguage) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }
  