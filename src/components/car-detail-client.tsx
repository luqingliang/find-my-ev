"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { brandLabel, t } from "@/lib/i18n";
import { createSimplifiedParamNameSet } from "@/lib/simplified-params";
import { useLanguageStore } from "@/lib/useLanguageStore";
import { Car } from "@/types/car";

export function CarDetailClient({ car }: { car: Car }) {
  const language = useLanguageStore((s) => s.language);
  const text = t(language);
  const [simpleMode, setSimpleMode] = useState(true);
  const simplifiedNameSet = useMemo(() => createSimplifiedParamNameSet(), []);
  const simplifiedSections = useMemo(
    () =>
      car.paramsBySection
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => simplifiedNameSet.has(item.name))
        }))
        .filter((section) => section.items.length > 0),
    [car.paramsBySection, simplifiedNameSet]
  );

  return (
    <div className="space-y-5">
      <section className="panel overflow-hidden">
        <div className="space-y-3 p-5 md:p-6">
          <p className="text-sm uppercase tracking-[0.15em] text-slate-500">{brandLabel(car.brand, car.brandZh, language)}</p>
          <h1 className="text-3xl font-bold tracking-tight">{car.model}</h1>
          {car.priceCny > 0 ? (
            <p className="text-lg font-semibold text-emerald-700">
              {car.priceCny.toLocaleString()} {language === "zh" ? "元" : "CNY"}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {car.highlights.map((item) => (
              <span key={item} className="glass-chip px-3 py-1 text-xs font-medium text-emerald-800">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">{language === "zh" ? "参数展示模式" : "Parameter Mode"}</p>
          <div className="glass-chip p-1">
            <button
              type="button"
              onClick={() => setSimpleMode(false)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !simpleMode ? "glass-btn-primary text-black" : "text-slate-700 hover:bg-white/60"
              }`}
            >
              {language === "zh" ? "完整" : "Full"}
            </button>
            <button
              type="button"
              onClick={() => setSimpleMode(true)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                simpleMode ? "glass-btn-primary text-black" : "text-slate-700 hover:bg-white/60"
              }`}
            >
              {language === "zh" ? "简化" : "Simple"}
            </button>
          </div>
        </div>
      </section>

      <section className="py-5 md:py-6">
        {simpleMode ? (
          <div className="space-y-4">
            {simplifiedSections.map((section) => (
              <section key={section.name} className="glass-panel overflow-hidden rounded-2xl">
                <h3 className="px-5 pb-2 pt-4 text-left text-xl font-bold uppercase tracking-wide text-slate-700 md:px-6 md:text-2xl">
                  {section.name}
                </h3>
                <div className="mx-5 border-b border-white/70 md:mx-6" />
                <div>
                  {section.items.map((item) => (
                    <div
                      key={`${section.name}-${item.key}-${item.name}`}
                      className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm md:grid-cols-[180px_1fr] md:px-6"
                    >
                      <div className="text-slate-500">{item.name}</div>
                      <div className="font-semibold text-ink">{item.value || "-"}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {car.paramsBySection.map((section) => (
              <section key={section.name} className="glass-panel overflow-hidden rounded-2xl">
                <h3 className="px-5 pb-2 pt-4 text-left text-xl font-bold uppercase tracking-wide text-slate-700 md:px-6 md:text-2xl">
                  {section.name}
                </h3>
                <div className="mx-5 border-b border-white/70 md:mx-6" />
                <div>
                  {section.items.map((item) => (
                    <div
                      key={`${section.name}-${item.key}-${item.name}`}
                      className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm md:grid-cols-[180px_1fr] md:px-6"
                    >
                      <div className="text-slate-500">{item.name}</div>
                      <div className="font-semibold text-ink">{item.value || "-"}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-2">
        <Link
          href={`/series/${encodeURIComponent(car.seriesName)}`}
          className="glass-btn inline-flex px-4 py-2 text-sm font-medium"
        >
          {text.backToSeries}
        </Link>
        <Link href="/" className="glass-btn inline-flex px-4 py-2 text-sm font-medium">
          {text.navHome}
        </Link>
        <Link href={`/compare?ids=${car.id}`} className="glass-btn glass-btn-primary inline-flex px-4 py-2 text-sm font-medium">
          {text.compareThis}
        </Link>
      </div>
    </div>
  );
}
