"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useCompareStore } from "@/lib/useCompareStore";
import { useLanguageStore } from "@/lib/useLanguageStore";

export function SiteHeader() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const ids = useCompareStore((s) => s.ids);
  const text = t(language);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {text.siteTitle}
        </Link>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-slate-300 p-1">
            <button
              type="button"
              onClick={() => setLanguage("zh")}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                language === "zh" ? "bg-ink text-white" : "text-slate-700"
              }`}
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                language === "en" ? "bg-ink text-white" : "text-slate-700"
              }`}
            >
              EN
            </button>
          </div>
          <Link
            href="/compare"
            className="rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            {text.navCompare}（{ids.length}/4）
          </Link>
        </div>
      </div>
    </header>
  );
}
