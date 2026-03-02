import { create } from "zustand";

export type Language = "zh" | "en";

type LanguageStore = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: "zh",
  setLanguage: (language) => set({ language })
}));
