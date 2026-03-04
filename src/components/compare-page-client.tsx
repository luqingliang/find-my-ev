"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useMemo } from "react";
import { brandLabel, t } from "@/lib/i18n";
import { carMap } from "@/data/cars";
import { useCompareStore } from "@/lib/useCompareStore";
import { useLanguageStore } from "@/lib/useLanguageStore";
import type { Car } from "@/types/car";

const MAX_COMPARE_COUNT = 4;

export function ComparePageClient({ queryIds }: { queryIds: string[] }) {
  const ids = useCompareStore((s) => s.ids);
  const setIds = useCompareStore((s) => s.setIds);
  const clear = useCompareStore((s) => s.clear);
  const language = useLanguageStore((s) => s.language);
  const text = t(language);

  useEffect(() => {
    setIds(queryIds);
  }, [queryIds, setIds]);

  const cars = useMemo(() => ids.map((id) => carMap.get(id)).filter((car): car is Car => Boolean(car)), [ids]);

  const specCategories = useMemo(() => {
    const sectionMap = new Map<string, Set<string>>();
    const order: string[] = [];

    for (const car of cars) {
      for (const section of car.paramsBySection) {
        if (!sectionMap.has(section.name)) {
          sectionMap.set(section.name, new Set<string>());
          order.push(section.name);
        }
        for (const item of section.items) {
          sectionMap.get(section.name)?.add(item.name);
        }
      }
    }

    return order.map((sectionName) => ({
      title: sectionName,
      rows: [...(sectionMap.get(sectionName) ?? [])].map((label) => ({
        label,
        render: (id: string) => {
          const car = carMap.get(id);
          return car?.paramValueByName[label] || "-";
        }
      }))
    }));
  }, [cars]);

  const columns = `140px repeat(${cars.length}, minmax(0, 1fr))`;

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
                  <Image src={car.image} alt={car.model} width={320} height={180} unoptimized className="h-20 w-auto object-contain" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {brandLabel(car.brand, car.brandZh, language)}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-tight">{car.model}</h2>
              </article>
            ))}

            {specCategories.map((category) => (
              <Fragment key={category.title}>
                <div
                  className="mt-2 rounded-lg bg-slate-100 pl-0 pr-3 py-2 text-left text-xl font-bold uppercase tracking-wide text-slate-700 md:text-2xl"
                  style={{ gridColumn: "1 / -1" }}
                >
                  {category.title}
                </div>
                <div className="border-b border-slate-300" style={{ gridColumn: "1 / -1" }} />
                {category.rows.map((row) => (
                  <Fragment key={`${category.title}-${row.label}`}>
                    <div className="flex items-center py-4 text-sm font-normal text-gray-500">
                      {row.label}
                    </div>
                    {cars.map((car) => (
                      <div
                        key={`${row.label}-${car.id}`}
                        className="flex items-center justify-center py-4 text-center text-base font-semibold text-ink"
                      >
                        {row.render(car.id)}
                      </div>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
