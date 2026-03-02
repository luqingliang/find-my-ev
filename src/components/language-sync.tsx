"use client";

import { useEffect } from "react";
import { useLanguageStore, Language } from "@/lib/useLanguageStore";
import { t } from "@/lib/i18n";

const STORAGE_KEY = "ev-lang";

export function LanguageSync() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "zh" || raw === "en") {
      setLanguage(raw as Language);
    }
  }, [setLanguage]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    document.title = t(language).siteTitle;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return null;
}
