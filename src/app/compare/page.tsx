"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { brandLabel, t } from "@/lib/i18n";
import { carMap } from "@/data/cars";
import { useCompareStore } from "@/lib/useCompareStore";
import { useLanguageStore } from "@/lib/useLanguageStore";

const MAX_COMPARE_COUNT = 4;

export default function ComparePage() {
  const searchParams = useSearchParams();
  const ids = useCompareStore((s) => s.ids);
  const setIds = useCompareStore((s) => s.setIds);
  const clear = useCompareStore((s) => s.clear);
  const language = useLanguageStore((s) => s.language);
  const text = t(language);

  useEffect(() => {
    const idsFromQuery = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
    if (idsFromQuery.length) {
      setIds(idsFromQuery);
    }
  }, [searchParams, setIds]);

  const cars = useMemo(() => ids.map((id) => carMap.get(id)).filter(Boolean), [ids]);

  if (!cars.length) {
    return (
      <section className="panel p-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{text.emptyCompare}</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{text.emptyCompareDesc}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {text.backToList}
        </Link>
      </section>
    );
  }

  const specRows = [
    {
      label: text.price,
      render: (id: string) => {
        const car = carMap.get(id);
        return car ? `${car.priceCny.toLocaleString()} ${language === "zh" ? "元" : "CNY"}` : "-";
      }
    },
    {
      label: text.range,
      render: (id: string) => {
        const car = carMap.get(id);
        return car ? `${car.rangeKm} km` : "-";
      }
    },
    {
      label: text.battery,
      render: (id: string) => {
        const car = carMap.get(id);
        return car ? `${car.batteryKWh} kWh` : "-";
      }
    },
    {
      label: text.maxPower,
      render: (id: string) => {
        const car = carMap.get(id);
        return car ? `${car.maxPowerKw} kW` : "-";
      }
    },
    {
      label: text.zeroToHundred,
      render: (id: string) => {
        const car = carMap.get(id);
        return car ? `${car.zeroToHundredSec} s` : "-";
      }
    },
    {
      label: text.charge,
      render: (id: string) => {
        const car = carMap.get(id);
        return car ? `${car.fastChargeMin} min` : "-";
      }
    }
  ];

  const columns = `140px repeat(${cars.length}, minmax(0, 1fr))`;

  return (
    <div className="space-y-6">
      <section className="panel p-8 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{text.parameters}</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{text.compareTitle}</h1>
            <p className="text-sm text-slate-600">
              {text.selectedCars} {cars.length} {text.carsUnit}
            </p>
          </div>
          <div className="flex gap-2">
            {cars.length < MAX_COMPARE_COUNT ? (
              <Link
                href="/"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-slate-400"
              >
                {text.continueAdd}
              </Link>
            ) : null}
            <button
              onClick={clear}
              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              {text.clearCompare}
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white/90 shadow-panel">
        <div className="min-w-[760px] p-4 md:min-w-0 md:p-6">
          <div className="grid gap-x-3 gap-y-4" style={{ gridTemplateColumns: columns }}>
            <div />
            {cars.map((car) => (
              <article key={car.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-5 text-center">
                <button
                  type="button"
                  onClick={() => setIds(ids.filter((id) => id !== car.id))}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm leading-none text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                  aria-label={language === "zh" ? "移除该车型" : "Remove this vehicle"}
                >
                  ×
                </button>
                <div className="mx-auto flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img src={car.image} alt={car.model} className="h-20 w-auto object-contain" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {brandLabel(car.brand, car.brandZh, language)}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-tight">{car.model}</h2>
              </article>
            ))}

            {specRows.map((row) => (
              <Fragment key={row.label}>
                <div className="flex items-center border-t border-slate-200 py-4 text-sm font-semibold text-slate-600">
                  {row.label}
                </div>
                {cars.map((car) => (
                  <div
                    key={`${row.label}-${car.id}`}
                    className="flex items-center justify-center border-t border-slate-200 py-4 text-center text-base font-semibold text-ink"
                  >
                    {row.render(car.id)}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
