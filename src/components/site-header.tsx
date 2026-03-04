"use client";

import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/useLanguageStore";

export function SiteHeader() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const text = t(language);

  return (
    <header className="sticky top-0 z-30 bg-white/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="px-1 py-1" aria-label={text.siteTitle}>
          <Image src="/logo.svg" alt="EvLab logo" width={128} height={44} priority />
        </Link>
        <div className="flex items-center gap-2">
          <div className="glass-chip p-1.5">
            <button
              type="button"
              onClick={() => setLanguage("zh")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                language === "zh"
                  ? "glass-btn-primary text-black ring-1 ring-white/80 shadow-md"
                  : "text-slate-700 hover:bg-white/60"
              }`}
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                language === "en"
                  ? "glass-btn-primary text-black ring-1 ring-white/80 shadow-md"
                  : "text-slate-700 hover:bg-white/60"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
