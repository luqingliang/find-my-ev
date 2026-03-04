"use client";

import Link from "next/link";
import { brandLabel, t } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/useLanguageStore";
import { Car } from "@/types/car";

export function CarDetailClient({ car }: { car: Car }) {
  const language = useLanguageStore((s) => s.language);
  const text = t(language);

  return (
    <div className="space-y-5">
      <section className="panel overflow-hidden">
        <div className="space-y-3 p-5 md:p-6">
          <p className="text-sm uppercase tracking-wide text-slate-500">{brandLabel(car.brand, car.brandZh, language)}</p>
          <h1 className="text-3xl font-bold tracking-tight">{car.model}</h1>
          {car.priceCny > 0 ? (
            <p className="text-lg font-semibold text-emerald-700">
              {car.priceCny.toLocaleString()} {language === "zh" ? "元" : "CNY"}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {car.highlights.map((item) => (
              <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 md:py-6">
        <div className="space-y-4">
          {car.paramsBySection.map((section) => (
            <section key={section.name} className="overflow-hidden rounded-2xl bg-white">
              <h3 className="px-5 pt-4 pb-2 text-left text-xl font-bold uppercase tracking-wide text-slate-700 md:px-6 md:text-2xl">
                {section.name}
              </h3>
              <div className="mx-5 border-b border-slate-200 md:mx-6" />
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
      </section>

      <div className="flex gap-2">
        <Link
          href={`/series/${encodeURIComponent(car.seriesName)}`}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
        >
          {text.backToSeries}
        </Link>
        <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">
          {text.navHome}
        </Link>
        <Link href={`/compare?ids=${car.id}`} className="rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white">
          {text.compareThis}
        </Link>
      </div>
    </div>
  );
}
