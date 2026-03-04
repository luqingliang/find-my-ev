"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { brandLabel, t } from "@/lib/i18n";
import { useCompareStore } from "@/lib/useCompareStore";
import { useLanguageStore } from "@/lib/useLanguageStore";
import type { CarSeries } from "@/types/car";

export function SeriesDetailClient({ series }: { series: CarSeries }) {
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);
  const text = t(language);
  const ids = useCompareStore((s) => s.ids);
  const toggleId = useCompareStore((s) => s.toggleId);
  const sortedCars = useMemo(
    () =>
      [...series.cars].sort((a, b) => {
        if (a.priceCny !== b.priceCny) return a.priceCny - b.priceCny;
        return a.trimName.localeCompare(b.trimName, "zh-Hans-CN");
      }),
    [series.cars]
  );

  return (
    <div className="space-y-5">
      <section className="panel p-5 md:p-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {brandLabel(series.brand, series.brandZh, language)} - {series.name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {series.cars.length} {text.modelsUnit}
        </p>
      </section>

      <section className="panel p-4 md:p-5">
        <div className="space-y-3">
          {sortedCars.map((car) => {
            const active = ids.includes(car.id);
            return (
              <article
                key={car.id}
                className="glass-panel cursor-pointer rounded-xl p-4 transition hover:-translate-y-0.5"
                onClick={() => router.push(`/cars/${car.id}`)}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{series.name}</p>
                    <h2 className="text-lg font-semibold">{car.trimName}</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>
                      <p>{text.range}</p>
                      <p className="font-semibold text-ink">{car.rangeKm} km</p>
                    </div>
                    <div>
                      <p>{text.charge}</p>
                      <p className="font-semibold text-ink">{car.fastChargeMin} min</p>
                    </div>
                    <div>
                      <p>{text.zeroToHundred}</p>
                      <p className="font-semibold text-ink">{car.zeroToHundredSec}s</p>
                    </div>
                  </div>
                  <div className="glass-soft flex items-center justify-between rounded-lg p-2">
                    <p className="text-right text-sm font-semibold text-emerald-700">
                      {car.priceCny.toLocaleString()} {language === "zh" ? "元" : "CNY"}
                    </p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleId(car.id);
                      }}
                      className={`glass-btn rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? "glass-btn-primary"
                          : "text-slate-700"
                      }`}
                    >
                      {active ? text.added : text.addCompare}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div>
        <Link href="/" className="glass-btn inline-flex px-4 py-2 text-sm font-medium">
          {text.navHome}
        </Link>
      </div>
    </div>
  );
}
