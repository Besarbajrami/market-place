export const SUPPORTED_LANGUAGES = ["en", "mk", "sq"] as const;
export type AppLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: AppLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "app_language";
